import ViewerImage from './viewer-image'
import TEMPLATE from '../shared/template'

export default class Viewer {
  constructor (source, options) {
    this.images = []
    this.container = document.body
    this.init(source)
    this.initViewer()
  }

  init (source) {
    // isElement
    // todo element or Array[img]
    const isImg = source && source.tagName.toLowerCase() === 'img'
    let images = isImg ? [source] : source.querySelectorAll('img')
    images.forEach((image) => {
      this.images.push(new ViewerImage(image))
    })
  }

  initViewer () {
    const container = document.createElement('div')
    container.innerHTML = TEMPLATE
    this.container.appendChild(container)
  }
}