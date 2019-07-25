import ViewerImage from './viewer-image'
import TEMPLATE from '../shared/template'
import {
  addClass,
  removeClass
} from '../helpers/dom'

export default class Viewer {
  constructor (source, options) {
    this.images = []
    this.container = document.body
    this.viewer = null
    this.initImage(source)
    this.initViewer()
  }

  initImage (source) {
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
    this.viewer = container.querySelector('.viewer-container')
  }

  show () {
    addClass(this.container, 'viewer-open')
    addClass(this.viewer, 'viewer-show')
  }

  hide () {
    removeClass(this.container, 'viewer-open')
    removeClass(this.viewer, 'viewer-show')
    addClass(this.viewer, 'viewer-close')
  }
}