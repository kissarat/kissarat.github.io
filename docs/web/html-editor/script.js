const form = document.getElementById('editor')
const input = document.querySelector('textarea')
const article = document.querySelector('article')
function render(text) {
    if (text) {
        input.value = text
    }
    article.innerHTML = text || input.value
}

window.addEventListener('load', function () {
    render(localStorage.getItem('draft') || template)
    document.body.firstElementChild.removeAttribute('v-cloak')
})

window.addEventListener('unload', function () {
    this.localStorage.setItem('draft', input.value)
})

form.addEventListener('submit', function (e) {
    e.preventDefault()
    render()
})

const template = `
<h2>HTML Forms</h2>
<form style="text-align:center;">
<p>Choose file: <input type="file"></p>
<p>Choose color: <input type="color"></p>
<p>Change number: <input type="number"></p>
<p>Range: <input type="range" min="2" step="1" max="8"></p>
</form>

<iframe
    width="320"
    height="240"
    src="https://www.youtube.com/embed/9Cxle4Ha3TQ?autoplay=0">
</iframe>
`
