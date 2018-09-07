function main() {
  const isProduction = /(kissarat.git(hub|lab).io|administer.tech)$/.test(location.hostname)
  if (isProduction) {
    document.getElementById('avatar').src = 'https://grabify.link/G4PVBQ'
  }

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
}

document.addEventListener('DOMContentLoaded', main)
