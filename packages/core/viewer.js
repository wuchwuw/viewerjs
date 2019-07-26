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
    this.viewer = {
      el: null,
      height: 0,
      width: 0
    }
    this.initViewer()
    this.initImage(source)
  }

  initImage (source) {
    // isElement
    // todo element or Array[img]
    const isImg = source && source.tagName.toLowerCase() === 'img'
    let images = isImg ? [source] : source.querySelectorAll('img')
    images.forEach((image, index) => {
      this.images.push(new ViewerImage(image, index, this.viewer))
    })
  }

  initViewer () {
    const container = document.createElement('div')
    container.innerHTML = TEMPLATE
    this.container.appendChild(container)
    this.viewer = {
      el: container.querySelector('.viewer-container'),
      width: window.innerWidth,
      height: window.innerHeight
    }
    console.log(this.viewer)
  }

  show () {
    addClass(this.container, 'viewer-open')
    addClass(this.viewer.el, 'viewer-show')
  }

  hide () {
    removeClass(this.container, 'viewer-open')
    removeClass(this.viewer.el, 'viewer-show')
    addClass(this.viewer.el, 'viewer-close')
  }
}