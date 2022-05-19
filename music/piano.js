if (!window.AudioContext) {
    const m = 'No AudioContext. Change browser, please'
    alert(m)
    throw new Error(m)
}

const TUNE = 24 / 25
const tunes = {
    '&': TUNE,
    '#': 1 / TUNE,
    '@': 1
}

const BASE = 2

const config = {
    duration: {
        base: BASE,
        value: BASE / 8
    },

    shift: 0
}

const baseNotes = {
    C: 16.352,
    D: 18.354,
    E: 20.602,
    F: 21.827,
    G: 24.500,
    A: 27.500,
    H: 30.868,
}

const restSymbols = {
    '*1': "\uD834\uDD3A",
    '*0': "\uD834\uDD3B",
    ':1': "\uD834\uDD3C",
    ':2': "\uD834\uDD3D",
    ':3': "\uD834\uDD3E",
    ':4': "\uD834\uDD3F",
    ':5': "\uD834\uDD40",
    ':6': "\uD834\uDD41",
    ':7': "\uD834\uDD42",
}

const noteKeys = Object.keys(baseNotes)

const octaves = []
const notes = []
for (let i = 0; i <= 8; i++) {
    octaves[i] = Math.pow(2, i)
    for (let j = 0; j < noteKeys.length; j++) {
        notes.push(noteKeys[j] + i)
    }
}

function wait(duration) {
    return { duration }
}

const expressions = {
    duration: {
        test: /^([*:])(\d+)(\.{1,3})?/,
        run(operator, duration, appendix) {
            const b = config.duration.base
            duration = Math.pow(2, duration)
            duration = '*' === operator ? b * duration : b / duration
            if (appendix) {
                const baseDuration = duration
                for (let i = 1; i <= appendix.length; i++) {
                    duration += baseDuration / Math.pow(2, i)
                }
            }
            //        console.log(duration)
            return duration
        }
    },

    note: {
        test: /^([CDEFGAH])([0-8])/,
        grammar: [false, false, 'note', 'duration'],
        run(n, octave, note = { oscillators: [] }, duration) {
            note.oscillators.push(baseNotes[n] * octaves[octave])
            if (duration) {
                note.duration = duration
            }
            return note
        }
    },

    tune: {
        test: /^([&#@])/,
        grammar: [false, 'note'],
        run(tune, note) {
            note.tune = tunes[tune]
            return note
        }
    }
}

class Expression {
    constructor(options) {
        Object.assign(this, options)
    }

    parse(directive) {
        if (this.run) {
            const test = this.test.exec(directive)
            const args = [].slice.call(test, 1)
            if (this.grammar) {
                if (directive = directive.replace(this.test, '')) {
                    for (let i = 0; i <= 10 && directive; i++) {
                        const name = this.grammar[i]
                        if (name) {
                            const exp = expressions[name]
                            const right = directive.replace(exp.test, '')
                            if (directive.length > right.length) {
                                args.push(exp.parse(directive))
                            }
                            else {
                                args[i] = undefined
                            }
                            directive = right
                        }
                    }
                }
            }
            return this.run(...args)
        }
        return directive
    }

    static find(directive) {
        for (const name in expressions) {
            const exp = expressions[name]
            if (exp.test.exec(directive)) {
                return exp
            }
        }
    }

    static parse(token) {
        const exp = Expression.find(token)
        if (exp) {
            let r = exp.parse(token)
            if ('number' === typeof r) {
                r = wait(r)
            }
            return r
        }
    }
}

function scan(str) {
    return str.trim().split(/\s+/)
}

function parse(tokens) {
    if ('string' === typeof tokens) {
        tokens = scan(tokens)
    }
    return tokens.map(Expression.parse)
}

for (const name in expressions) {
    expressions[name] = new Expression(expressions[name])
}

class Player {
    constructor(options) {
        if (options) {
            Object.assign(this, options)
        }
        if (!this.audioContext) {
            this.audioContext = new AudioContext()
            this.started = Date.now()
        }
        this.nodes = []
        if ('function' === typeof this.initialize) {
            this.initialize()
        }
    }

    addNode(node) {
        if (!(node instanceof AudioNode)) {
            const kind = node.kind
            delete node.kind
            const o = node
            node = this.audioContext['create' + kind]()
            for (const key in o) {
                const param = node[key]
                const v = o[key]
                if (param && param instanceof AudioParam) {
                    param.value = v
                }
                else {
                    node[key] = v
                }
            }
        }
        node.connect(this.destination)
        this.nodes.push(node)
        return node
    }

    get destination() {
        return this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : this.audioContext.destination
    }

    setWave(a1, a2, b1, b2, options) {
        const a = new Float32Array(2)
        const b = new Float32Array(2)
        a[0] = a1
        a[1] = a2
        b[0] = b1
        b[1] = b2
        this.wave = this.audioContext.createPeriodicWave(a, b, options)
    }

    play(molecules) {
        let string
        if ('string' === typeof molecules) {
            string = molecules
            molecules = parse(molecules)
        }

        const c = this.audioContext
        let time = this.endTime > c.currentTime ? this.endTime : c.currentTime
        let tune = 1
        for (let m of molecules) {
            if ('string' === typeof m) {
                m = Expression.parse(m)
            }
            if ('function' === typeof this.filter) {
                m = this.filter(m)
            }
            const duration = m.duration || config.duration.value
            if (m.tune > 0) {
                tune = 1 == m.tune ? 1 : (tune * m.tune)
            }
            if (m.oscillators) {
                for (let frequency of m.oscillators) {
                    let gain
                    let delay = 0
                    if (frequency instanceof Array) {
                        [frequency, gain, delay = 0] = frequency
                    }
                    const osc = c.createOscillator()
                    let dest
                    if (gain >= 0 && gain < 1) {
                        dest = c.createGain()
                        dest.gain.value = gain
                        dest.connect(this.destination)
                    }
                    else {
                        dest = this.destination
                    }
                    if (this.wave) {
                        osc.setPeriodicWave(this.wave)
                    }
                    osc.start(delay + time)
                    osc.stop(delay + time + duration)
                    osc.frequency.value = frequency * tune
                    osc.connect(dest)
                }
            }
            time += config.shift + duration
        }
        this.endTime = time
        const timeout = Math.floor(this.started + (time * 1000)) - Date.now()
        setTimeout(function () {
            const div = document.createElement('pre')
            const sourceCode = document.getElementById('notes')
            div.innerHTML = string
                .replace(/\s+/g, '&nbsp;')
                .replace(/([CDEFGAH])([0-8])/g, function (s, n, octave) {
                    const hue = 60 + Math.round(noteKeys.indexOf(n) * 140 / noteKeys.length)
                    const lightness = Math.round(15 + (octave / octaves.length) * 50)
                    return `<span class="note" style="color: hsl(${hue}, 100%, ${lightness}%)">${n}${octave}</span>`
                })
                .replace(/([*:])(\d+)(\.{1,3})?/g, function (s, operation, delay, dots = '') {
                    const char = restSymbols[operation + delay]
                    if (localStorage.font && char) {
                        return `<span class="notation">${char}</span>`
                    }
                    else {
                        const hue = (240 + Math.round((Math.max(Math.min(delay, 6), 1) - 1) * 30)) % 360
                        return `<span class="delay" style="background-color: hsl(${hue}, 100%, 86%)">${operation + delay + dots}</span>`
                    }
                })
            sourceCode.appendChild(div)
        },
            timeout)
    }
}

function range(start, end, appendix = 1) {
    start = notes.indexOf(start)
    end = notes.indexOf(end)
    return end >= start
        ? notes.slice(start, end + appendix)
        : notes.slice(end, start + appendix).reverse()
}

function symmetric(start, end) {
    return range(start, end, 0)
        .concat(range(end, start))
}

function mode(n) {
    return function (octave = 4) {
        return range(n + octave, n + (octave + 1))
    }
}

const ionian = mode('C')

function multi(array, ...offsets) {
    for (let i = 0; i < array.length; i++) {
        let v = array[i]
        let p = notes.indexOf(v)
        for (const offset of offsets) {
            v += notes[p + offset]
        }
        array[i] = v
    }
    return array
}

function overtone(input, n, gain) {
    const output = []
    for (let i = 0; i < input.length; i++) {
        const ovt = input[i] * n
        output.push(gain > 0 ? [ovt, gain] : ovt)
    }
    return output
}

const playerConfig = {
    initialize() {
        this.addNode({
            kind: 'BiquadFilter',
            frequency: 1000
        })
    },

    filter(m) {
        if (m.oscillators) {
            let array = []
            for (let i = 1; i < 4; i++) {
                array = array.concat(overtone(m.oscillators, i, Math.pow(i, -2)))
            }
            m.oscillators = m.oscillators.concat(array)
        }
        return m
    }
}



function repeat(n, segment) {
    const r = []
    for (let i = 0; i < n; i++) {
        r.push(segment)
    }
    return r.join(' ')
}

const sourceText = `:6 C4 H3D4 E4 A3F4
:6 E4 C4F4 F4 C4G4
:6 F4 D4H4 A4 D4A4
:6 G4 D4H4 F4 D4F4
:6 F4 D4A4 D4 D4A4
:6 E4 E4G4 C4 D4A4
:6 F4 D4A4 D4 D4A4
:6 E4 E4G4 C4 D4A4
:6 G4 D4H4 F4 D4F4
:6 F4 D4A4 D4 D4A4
:6 E4 E4G4 C4 D4A4
:6 F4 D4A4 D4 D4A4
:6 E4 E4G4 C4 D4A4
:6 D4 E4F4 D4 F4G4
:6 E4 E4G4 C4 D4A4
:6 F4 D4A4 D4 D4A4
:6 E4 E4G4 C4 D4A4
:6 D4 E4F4 D4 F4G4
:6 E4 E4G4 C4 D4A4
:6 E4 F4F4 D4 D4G4
:6 F4 G4F4 F4 E4G4
:6 G4 A4F4 G4 E4A4
:6 F4 G4F4 F4 E4G4
:6 E4 F4F4 E4 E4G4
:6 F4 G4F4 F4 E4G4
:6 G4 A4F4 G4 E4A4
:6 A4 H4F4 A4 E4H4
:6 A4 H4E4 A4 D4H4
:6 G4 H4E4 G4 D4H4
:6 G4 H4F4 G4 E4H4
:6 F4 A4F4 F4 E4A4
:6 F4 G4F4 F4 E4G4
:6 G4 G4F4 G4 E4G4
:6 G4 G4G4 G4 F4G4
:6 G4 F4G4 G4 F4F4
:6 G4 E4G4 G4 F4E4
:6 A4 E4G4 A4 F4E4
:6 A4 E4G4 H4 F4E4
:6 A4 E4F4 H4 F4D4
:6 A4 E4E4 H4 F4C4
:6 H4 E4D4 H4 F4C4
:6 G4 E4D4 H4 F4C4
:6 G4 E4C4 H4 F4C4
:6 F4 E4C4 H4 F4C4
:6 F4 E4C4 A4 F4C4
:6 F4 C4H3 A4 F4H3
:6 F4 E4C4 A4 F4C4
:6 A4 C4H3 A4 F4H3
:6 F4 E4H3 A4 F4H3
:6 F4 E4H3 G4 F4H3
:6 E4 E4H3 F4 F4H3
:6 E4 E4H3 F4 E4A3
:6 E4 E4A3 F4 E4G3
:6 D4 E4A3 G4 E4G3
:6 C4 E4A3 A4 E4G3
:6 H3 F4A3 H4 E4G3
:6 H3 G4A3 H4 F4G3
:6 H3 A4A3 H4 G4G3
:6 C4 A4A3 H4 G4A3
:6 D4 A4A3 H4 G4H3
:6 D4 A4H3 H4 H4H3
:6 D4 A4H3 C5 H4H3
:6 E4 A4H3 C5 H4C4
:6 F4 H4H3 C5 H4D4
:6 F4 H4H3 H4 A4D4
:6 F4 H4H3 A4 G4D4
:6 F4 H4H3 G4 G4D4
:6 F4 H4H3 F4 G4D4
:6 F4 H4H3 F4 G4D4
:6 G4 H4C4 E4 G4D4
:6 G4 H4C4 E4 A4C4
:6 G4 C5C4 E4 A4C4
:6 G4 C5C4 E4 H4C4
:6 G4 C5C4 E4 C5C4
:6 G4 C5D4 D4 C5C4
:6 G4 C5D4 C4 C5C4
:6 G4 H4D4 C4 H4C4
:6 F4 H4D4 H3 H4C4
:6 D4 H4D4 H3 A4C4
:6 D4 H4C4 H3 A4H3
:6 D4 H4C4 A3 A4H3
:6 C4 H4C4 A3 A4H3
:6 H3 A4C4 A3 G4A3
:6 H3 G4C4 G3 G4A3
:6 H3 F4C4 G3 G4A3
:6 H3 E4C4 G3 F4A3
:6 A3 E4H3 G3 F4A3
:6 A3 E4H3 F3 F4G3`

function play(parallel) {
    for (const thread of parallel) {
        const player = new Player(playerConfig)
        for (const line of thread.trim().split(/\s*\n\s*/)) {
            player.play(line)
        }
    }
}

const keyboard = {
    5: 'qwertyu',
    4: 'asdfghj',
    3: 'zxcvbnm'
}

const keymap = {}
const state = {}

for (const octave in keyboard) {
    const letters = keyboard[octave].split('')
    for (let i = 0; i < letters.length; i++) {
        keymap[letters[i]] = noteKeys[i] + octave
    }
}

function toFrequency(n) {
    n = n.split('')
    return baseNotes[n[0]] * octaves[n[1]]
}

const saved = []

const c = new AudioContext()

addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase()
    const osc = c.createOscillator()
    const n = keymap[key]
    osc.frequency.value = toFrequency(n)
    osc.start()
    osc.connect(c.destination)
    state[key] = osc
    saved.push(n)
})

addEventListener('keyup', function (e) {
    const key = e.key.toLowerCase()
    const osc = state[key]
    osc.stop()
    delete state[key]
})

const pianoStore = new StateStore('piano', '1.0')

entrypoint([], function () {
    const input = document.getElementById('input')
    const state = pianoStore.getState() || { source: sourceText }
    input.value = state.source
    const form = document.getElementById('form')
    form.addEventListener('submit', function () {
        const source = input.value.trim()
        play([source])
        form.remove()
        pianoStore.setState({ source })
        return true
    })
})
