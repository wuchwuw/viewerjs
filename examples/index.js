import Viewer from '../packages'
import '../packages/style/index.css'

let source = document.getElementById('container')
let v = new Viewer(source)
source.addEventListener('click', function () {
  v.show()
})
console.log(v)