const KISSARAT_TRACK_SCRIPT_ID = 'kissarat_track'
(function () {
  function run() {

  }

  var script = document.getElementById(KISSARAT_TRACK_SCRIPT_ID)
  if (script) {
    run()
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
