import Viewer from '../src'
import '../src/style/index.css'

let source = document.getElementById('container')
let v = new Viewer(source)
source.addEventListener('click', function () {
  v.show()
})