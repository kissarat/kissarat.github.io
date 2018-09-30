function main() {
  // const isProduction = /(kissarat\.git(hub|lab)\.io|administer\.tech)$/.test(location.hostname);
  const isWide = 'function' === typeof matchMedia && matchMedia('(min-width: 768px)').matches

  if (isWide) {
    [].forEach.call(document.querySelectorAll('a'), function (a) {
      // if (/https:\/\/[\w.]*wikipedia\.org/.test(a.href)) {
      // a.setAttribute('data-href', a.href)
      // a.removeAttribute('href')
      // a.addEventListener('click', function (e) {
      //   e.preventDefault()
      //   return false
      // })
      // }
      // else {
      a.setAttribute('target', '_blank')
      // }
    })
  }

  new Vue({
    el: '#app',
    data: {
      large: false,
      project3: atob('T2NlYW4gb2YgRXRoZXJldW0='),
      project2: atob('QW50aWt2YXIgUGx1cw=='),
      project1: atob('SUNPIEhvbGRpbmc=')
    }
  })

  document.querySelector('#updated span').innerHTML = new Date(document.querySelector('#updated span').innerHTML).toLocaleDateString()

  // if (isProduction) {
  //   document.getElementById('avatar').src = 'https://grabify.link/G4PVBQ'
  // }

  const hired = document.getElementById('hired')
  function close() {
    removeEventListener('keyup', close)
    .remove()
  }

  addEventListener('keyup', close)

  setTimeout(function () {
    hired.style.opacity = 1
  }, 3000)
}

document.addEventListener('DOMContentLoaded', main)
