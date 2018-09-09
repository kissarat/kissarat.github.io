(function () {
  function getTrackID() {
    return (performance && 'function' === typeof performance.now ? performance.now() * 10000000000000 : Date.now()).toString(36)
  }

  const KISSARAT_TRACK_SCRIPT_ID = 'kissarat_track';
  const regex = new RegExp('/' + KISSARAT_TRACK_SCRIPT_ID + '=([^;]+)/')
  const match = regex.exec(document.cookie)
  var id = match ? match[1] : getTrackID()
  if (!match) {
    document.cookie = KISSARAT_TRACK_SCRIPT_ID + '=' + id + '; path=/; max-age='
        + 3600 * 24 * 365 * 10 // years
  }
  function main() {

  }

  var script = document.getElementById(KISSARAT_TRACK_SCRIPT_ID)
  if (script) {
    main()
    window.KISSARAT_TRACK_SCRIPT_ID = KISSARAT_TRACK_SCRIPT_ID
    console.log('Run main script of track.js')
  }
  else {
    script = document.createElement('script')
    script.src = 'https://track.administer.tech/track.js'
    script.id = KISSARAT_TRACK_SCRIPT_ID
    document.head.appendChild(script)
    script.addEventListener('load', function () {
      console.log('track.js loaded at ' + new Date().toLocaleString())
    })
  }
})()
