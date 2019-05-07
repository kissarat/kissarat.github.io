(function () {
  const script_guid = '764aa3cb-e252-4927-b7ab-d512a86864a2';
  const ID = 'kissarat';
  const id = s => ID + '_' + s;
  const KISSARAT_TRACK_SCRIPT_ID = id('track');
  const ORIGIN = /administer\.tech$/.test(location.hostname) ? location.origin : 'https://track.labiak.org'
  const STARTED = Date.now()
  const hasLocalStorage = 'object' === typeof localStorage;
  const DEBUG = hasLocalStorage && +localStorage.getItem('kissarat.track.debug') > 0
  const TRACK_ID_SCALE = 1000000000000000 // 10 ** 15
  const regex = new RegExp(KISSARAT_TRACK_SCRIPT_ID + '=([^;]+)')
  if (hasLocalStorage) {
    localStorage.setItem(id(Date.now().toString(36)), script_guid)
  }
  const history = []
  var ip

  function debug() {
    if (DEBUG) {
      console.log.apply(console, arguments)
    }
  }

  function getTrackID() {
    return 'z' + ('undefined' !== typeof performance && 'function' === typeof performance.now ? performance.now() * TRACK_ID_SCALE : Date.now()).toString(36)
  }

  function loadScript(src) {
    script = document.createElement('script')
    script.src = src
    setTimeout(function () {
      document.head.appendChild(script)
    }, 0)
    return script
  }

  function remember() {
    const args = [].slice.call(arguments)
    args.unshift(Date.now())
    debug.apply(null, args)
    history.push(args)
  }

  function register(elements, events, handler) {
    Array.prototype.forEach.call(elements, function (element) {
      events.forEach(function (event) {
        element.addEventListener(event, function (e) {
          handler(event, e)
        })
      })
    })
  }

  function main() {
    const match = regex.exec(document.cookie)
    var id = match ? match[1] : getTrackID()
    if (!match) {
      document.cookie = KISSARAT_TRACK_SCRIPT_ID + '=' + id + '; path=/; max-age='
          + 3600 * 24 * 365 * 10 // years
    }

    window[id] = function (r) {
      ip = r.ip
      delete window[id]
    }
    loadScript('https://api.ipify.org?format=jsonp&callback=' + id)
        .setAttribute('async', 'async')

    register(document.querySelectorAll('a[href]'), ['mouseenter', 'mouseleave'], function (event, e) {
      remember(event, e.currentTarget.getAttribute('href'))
    })

    register(document.querySelectorAll('img[src]'), ['mouseenter', 'mouseleave'], function (event, e) {
      remember(event, 'IMG', e.currentTarget.getAttribute('src'))
    })

    register([window], ['keyup'], function (event, e) {
      const t = e.target;
      var a = null
      remember(event, ((a = t.getAttribute('name')) && ('[name="' + a + '"]'))
          || ((a = t.id) && ('#' + a))
          || ((a = t.getAttribute('class')) && ('.' + a.replace(/\s+/g, '.')))
          || t.tagName,
          e.key
      )
    })

    addEventListener('beforeunload', function () {
      const data = {
        auth: id,
        script_guid,
        start: STARTED,
        spend: Date.now() - STARTED
      }
      if (ip) {
        data.xip = ip
      }
      if ('string' === typeof document.referrer && document.referrer) {
        data.referrer = document.referrer
      }
      if (history.length > 0) {
        data.history = history
      }
      navigator.sendBeacon(ORIGIN + '/report' + location.pathname
          + (location.search ? '?' + location.search : ''),
          // DEBUG ? JSON.stringify(data, null, '\t') : JSON.stringify(data))
          JSON.stringify(data))
    })
  }

  var script = document.getElementById(KISSARAT_TRACK_SCRIPT_ID)
  if (script) {
    if ('function' === typeof navigator.sendBeacon) {
      main()
      window.KISSARAT_TRACK_SCRIPT_ID = KISSARAT_TRACK_SCRIPT_ID
      debug('Run main script of track.js')
    }
    else {
      console.error('navigator.sendBeacon not found')
    }
  }
  else {
    script = loadScript(ORIGIN + '/track.js')
    script.id = KISSARAT_TRACK_SCRIPT_ID
    script.addEventListener('load', function () {
      debug('track.js loaded at ' + new Date().toLocaleString())
    })
  }
})()
