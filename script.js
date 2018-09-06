function main() {
  const isProduction = 'kissarat.github.io' === location.hostname
  if (isProduction) {
    document.getElementById('avatar').src = 'https://grabify.link/G4PVBQ'
  }
}

document.addEventListener('DOMContentLoaded', main)
