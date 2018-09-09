(function () {
  const ORIGIN = /administer\.tech$/.test(location.hostname) ? location.origin : 'https://track.administer.tech'
  const STARTED = Date.now()
  const DEBUG = 'object' === typeof localStorage && +localStorage.getItem('kissarat.track.debug') > 0
  const history = []
  const TRACK_ID_SCALE = 1000000000000000
  function getTrackID() {
    return (performance && 'function' === typeof performance.now ? performance.now() * TRACK_ID_SCALE : Date.now()).toString(36)
  }

  const KISSARAT_TRACK_SCRIPT_ID = 'kissarat_track';
  const regex = new RegExp(KISSARAT_TRACK_SCRIPT_ID + '=([^;]+)')
  const match = regex.exec(document.cookie)
  var id = match ? match[1] : getTrackID()
  if (!match) {
    document.cookie = KISSARAT_TRACK_SCRIPT_ID + '=' + id + '; path=/; max-age='
        + 3600 * 24 * 365 * 10 // years
  }

  function remember() {
    const args = [].slice.call(arguments)
    args.unshift(Date.now())
    if (DEBUG) {
      console.log.apply(console, args)
    }
    this.history.push(args)
  }
  
  function register(elements, events, handler) {
    Array.prototype.forEach.call(elements, function (element) {
      events.forEach(function (event) {
        element.addEventListener(function (e) {
          handler(event, e)
        })
      })
    })
  }

  function anchor() {
    register(document.querySelector('a[href]'), ['mouseenter', 'mouseleave'], function (event, e) {
      remember(event, e.currentTarget.getAttribute('href'))
    })
  }
  
  function main() {

  }

  var script = document.getElementById(KISSARAT_TRACK_SCRIPT_ID)
  if (script) {
    main()
    window.KISSARAT_TRACK_SCRIPT_ID = KISSARAT_TRACK_SCRIPT_ID
    console.log('Run main script of track.js for ID=' + id)
  }
  else {
    script = document.createElement('script')
    script.src = ORIGIN + '/track.js?auth=' + id
    script.id = KISSARAT_TRACK_SCRIPT_ID
    document.head.appendChild(script)
    script.addEventListener('load', function () {
      console.log('track.js loaded at ' + new Date().toLocaleString())
    })
  }
})()
