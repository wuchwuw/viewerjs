import ViewerImage from './viewer-image'
import TEMPLATE from '../shared/template'
import {
  addClass,
  setStyle,
  removeClass,
  addEventListener
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
    this.touch = {}
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
    addEventListener(this.viewer.el, 'touchstart', this.onTouchStart.bind(this))
    addEventListener(this.viewer.el, 'touchmove', this.onTouchMove.bind(this))
    addEventListener(this.viewer.el, 'touchend', this.onTouchEnd)
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

  onTouchStart (e) {
    const touch = e.targetTouches
    if (touch && touch.length === 1) {
      this.touch = {
        pageX: touch[0].pageX,
        pageY: touch[0].pageY,
        x: 1
      }
    }
  }

  onTouchMove (e) {
    const touch = e.targetTouches
    let diff = this.touch.pageX - touch[0].pageX
    this.touch.x += 0.01
    setStyle(this.viewer.el, {
      transform: `translate3d(${diff * 1 / this.touch.x}px, 0, 0)`
    })
  }
}