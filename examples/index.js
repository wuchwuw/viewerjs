import Viewer from '../src'
import '../src/style/index.css'
import Hammer from 'hammerjs'

let source = document.getElementById('container')
let v = new Viewer(source)
source.addEventListener('click', function () {
  v.show()
})

let h = document.getElementById('h')
var hammer = new Hammer(h)
console.log(hammer)
hammer.on('tapstart', function(e) {
  // e.target.classList.toggle('expand');
  console.log("You're pressing me!");
  console.log(e);
});
