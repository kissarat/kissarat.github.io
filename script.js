function main() {
  // const isProduction = /(kissarat\.git(hub|lab)\.io|administer\.tech)$/.test(location.hostname)
  // if (isProduction) {
  //   document.getElementById('avatar').src = 'https://grabify.link/G4PVBQ'
  // }

  [].forEach.call(document.querySelectorAll('a'), function (a) {
    a.setAttribute('target', '_blank')
  })

  new Vue({
    el: '#app',
    data: {
      large: false,
      ico: atob('SUNPIEhvbGRpbmc=')
    }
  })

  document.querySelector('#updated span').innerHTML = new Date(document.querySelector('[http-equiv="last-modified"]').innerHTML).toLocaleDateString()
}

document.addEventListener('DOMContentLoaded', main)
