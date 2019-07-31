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
    this.parent = document.body
    this.container = null
    this.viewer = {
      el: null,
      height: 0,
      width: 0,
      contentWidth: 0
    }
    this.touch = {
      pageX: 0,
      pageY: 0,
      diff: 0,
      currentLeft: 0,
      currentIndex: 0
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
    this.viewer.contentWidth = this.viewer.width * this.images.length
  }

  initViewer () {
    const container = document.createElement('div')
    addClass(container, 'viewer-container')
    container.innerHTML = TEMPLATE
    this.parent.appendChild(container)
    this.container = container
    this.viewer = {
      el: container.querySelector('.viewer-wrap'),
      width: window.innerWidth,
      height: window.innerHeight
    }
    addEventListener(this.viewer.el, 'touchstart', this.onTouchStart.bind(this))
    addEventListener(this.viewer.el, 'touchmove', this.onTouchMove.bind(this))
    addEventListener(this.viewer.el, 'touchend', this.onTouchEnd.bind(this))
    addEventListener(this.viewer.el, 'click', this.onClick.bind(this))
  }

  show () {
    addClass(this.parent, 'viewer-open')
    addClass(this.container, 'viewer-show')
  }

  hide () {
    removeClass(this.parent, 'viewer-open')
    removeClass(this.viewer.el, 'viewer-show')
    addClass(this.viewer.el, 'viewer-close')
  }

  onTouchStart (e) {
    const touch = e.targetTouches
    if (touch && touch.length === 1) {
      this.touch.pageX = touch[0].pageX
      this.touch.pageY = touch[0].pageY
    }
  }

  onTouchMove (e) {
    const touch = e.targetTouches
    const { currentLeft } = this.touch
    let diff = touch[0].pageX - this.touch.pageX
    let left = touch.diff + touch.currentLeft
    let absLeft = Math.abs(left)
    let t = left
    if (left > 100) {
      t = 100
    } else if (absLeft > contentWidth - transformWidth) {
      t = -contentWidth + transformWidth 
    }
    setStyle(this.viewer.el, {
      transform: `translate3d(${left}px, 0, 0)`,
      transitionDuration: '0ms'
    })
    this.touch.diff = diff
  }

  onTouchEnd () {
    const { touch } = this
    const { el, width: transformWidth, contentWidth } = this.viewer
    let left = touch.diff + touch.currentLeft
    let absLeft = Math.abs(left)
    if (left > 0) {
      setStyle(el, {
        transform: `translate3d(0, 0, 0)`,
        transitionDuration: '500ms'
      })
      touch.currentLeft = 0
    } else if (absLeft > contentWidth - transformWidth) {
      setStyle(el, {
        transform: `translate3d(${-contentWidth + transformWidth}px, 0, 0)`,
        transitionDuration: '500ms'
      })
      touch.currentLeft = -contentWidth + transformWidth
    } else {
      let over = absLeft % transformWidth
      if (over > transformWidth / 2) {
        left = Math.ceil(absLeft / transformWidth) * -transformWidth
        setStyle(el, {
          transform: `translate3d(${left}px, 0, 0)`,
          transitionDuration: '300ms'
        })
      } else {
        left = Math.floor(absLeft / transformWidth) * -transformWidth
        setStyle(el, {
          transform: `translate3d(${left}px, 0, 0)`,
          transitionDuration: '300ms'
        })
      }
      if (touch.currentLeft - left === transformWidth) {
        touch.currentIndex++
      } else if (touch.currentLeft - left === -transformWidth) {
        touch.currentIndex--
      }
      // if (Math.abs(currentLeft - left) === transformWidth) {
      //   this.registeredImageEvent(this.dom.shared.currentIndex)
      // }
      touch.currentLeft = left
    }
    touch.diff = 0
  }
}