document.addEventListener('DOMContentLoaded', function() {
  const hired = document.getElementById("hired");

  if (hired) {
    function close() {
      removeEventListener("keyup", close);
      hired.remove();
    }

    addEventListener("keyup", close);
    document.querySelector('#hired button').addEventListener('click', close);

    setTimeout(function () {
      hired.style.removeProperty('display');
    }, 5000);

    setTimeout(function () {
      hired.style.opacity = '1';
    }, 7000);
  }
});
