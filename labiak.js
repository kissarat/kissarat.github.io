// Script for all pages that loads Google Analytics and Vue.js

const isDebug =
    "object" === typeof localStorage &&
    +localStorage.getItem('debug') > 0;

function setDebugMode(isDebug = true) {
    if (isDebug) {
        localStorage.setItem('debug', '1')
    } else {
        localStorage.removeItem('debug')
    }
}

function trace(...args) {
    if (isDebug) {
        console.trace(...args)
    }
}

// Object polyfill
(function polyfill() {
    const ObjectPolyfills = {
        values: function values(o) {
            'use strict';
            const values = []
            for (var key in o) {
                values.push(o[key])
            }
            return values
        },

        assign: function assign(target, varArgs) {
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        }
    }

    for (var objectMethod in ObjectPolyfills) {
        if ('function' !== typeof Object[objectMethod]) {
            Object.defineProperty(Object, objectMethod, {
                value: ObjectPolyfills[objectMethod],
                writable: true,
                configurable: true,
                enumerable: false
            })
        }
    }
})()

function getScript(src) {
    return new Promise(function (resolve, reject) {
        const settings = Object.assign({
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer'
        },
            'string' == typeof src
                ? { source: src }
                : src
        )
        const script = document.createElement('script')
        for (const name in settings) {
            script.setAttribute(name, settings[name])
        }
        script.addEventListener('load', function () {
            trace(`Script ${settings.src} was loaded`);
            resolve();
        })
        script.addEventListener('error', function (err) {
            trace(`Got error for script ${settings.src}:`, err);
            reject(err);
        })
        document.head.appendChild(script)
    })
}

function round(value, radix) {
    const scale = 10 ** radix
    return (Math.floor((value + Number.EPSILON) * scale) / scale)
}

const human = 'bot'
self['notfor' + human] = self['a' + (human.split('').reverse().join(''))];

function anchor(hostname) {
    return '<a href="https://' + hostname + '/">' + hostname + "</a>";
}

function anchorList(encoded) {
    return notforbot(encoded).split(" ").map(anchor).join(", ");
}

const googleAnalyticsId = 'UA-58031952-14'

const LabiakLibrary = {
    Vue: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.33/vue.global.min.js',
        integrity: 'sha512-nswZG83l1MggaGEAe/zLIbsVpZJUyqv+yg40f2CNp9QH5AOtOsjS4PSdWRDEr/v+R6YPhNJ1gvhDEJDOqh5qxQ=='
    },
    Moment: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment-with-locales.min.js',
        integrity: 'sha512-vFABRuf5oGUaztndx4KoAEUVQnOvAIFs59y4tO0DILGWhQiFnFHiR+ZJfxLDyJlXgeut9Z07Svuvm+1Jv89w5g=='
    },
    GoogleAnalytics: {
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
    }
}

const hasGoogleAnalytics = () => [].some.call(
    document.querySelectorAll('script'),
    script => script.src.indexOf('https://www.googletagmanager.com/gtag/js') === 0
)

function setupGoogleAnalytics(id = googleAnalyticsId) {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag("js", new Date());

    gtag("config", id);
}

async function setup(scripts) {
    const googleAnalyticsWasLoaded = hasGoogleAnalytics()
    if (googleAnalyticsWasLoaded) {
        setupGoogleAnalytics()
    } else {
        console.warn('Google Analytics required')
        scripts.unshift(LabiakLibrary.GoogleAnalytics)
    }
    await Promise.all(scripts.map(getScript))
    if (!googleAnalyticsWasLoaded) {
        setupGoogleAnalytics()
    }
}

function entrypoint(scripts, cb) {
    if ('complete' === document.readyState) {
        setup(scripts).then(cb)
    } else {
        document.addEventListener('DOMContentLoaded', () => setup(scripts).then(cb))
    }
}

function createApp(options) {
    return 'function' === typeof Vue
        ? new Vue(options)
        : Vue.createApp(options)
}

async function fetchJSON(url) {
    const r = await window.fetch(url)
    return r.json();
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
