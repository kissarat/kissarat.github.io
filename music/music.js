let context

const AudioContext = window.audioContext
    || window.AudioContext
    || window.AudioContext
    || window.webkitAudioContext
    ;

/**
 * @param {function} cb
 */
function withAudioContext(cb) {
    if (context) {
        context.close()
    }
    context = new AudioContext();
    cb(context);
}

function getScript(src) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script')
        script.src = src
        script.addEventListener('load', resolve)
        script.addEventListener('error', reject)
        document.head.appendChild(script)
    })
}

function round(value, radix) {
    const scale = 10 ** radix
    return Math.floor((value + Number.EPSILON) * scale) / scale
}

function entrypoint(cb) {
    document.addEventListener('DOMContentLoaded', function () {
        getScript('https://unpkg.com/vue@3').then(cb)
    })
}

class StateStore {
    constructor(name, version) {
        this.name = name
        this.version = version
    }

    getState() {
        try {
            const stateString = localStorage.getItem(this.name)
            if (stateString) {
                const { v, ...state } = JSON.parse(stateString)
                if (v === this.version) {
                    return state
                }
            }
        } catch (err) {
            console.warn(err)
        }
        return null;
    }

    setState(state) {
        localStorage.setItem(this.name, JSON.stringify({
            ...state,
            v: this.version
        }))
    }
}
