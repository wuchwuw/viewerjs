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
    this.zooming = false
    this.moving = false
    this.dbClickTimeout = null
    this.lastClickTime = 0
    this.viewer = {
      el: null,
      height: window.innerHeight,
      width: window.innerWidth,
      contentWidth: 0
    }
    this.touch = {
      pageX: 0,
      pageY: 0,
      diff: 0,
      currentLeft: 0,
      currentIndex: 0
    }
    this.imageZoom = {
      left: 0,
      top: 0,
      diff: 0
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
    this.image = this.images[this.touch.currentIndex]
  }

  initViewer () {
    const container = document.createElement('div')
    addClass(container, 'viewer-container')
    container.innerHTML = TEMPLATE
    this.parent.appendChild(container)
    this.container = container
    this.viewer.el = container.querySelector('.viewer-wrap')
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
    if (this.zooming && e.target === this.image.el) {
      this.handleImageZoomStart(e)
    } else {
      this.handleWrapPointerStart(e)
    }
  }

  onTouchMove (e) {
    if (this.zooming && e.target === this.image.el) {
      this.handleImageZoomMove(e)
    } else {
      this.handleWrapPointerMove(e)
    }
  }

  onTouchEnd (e) {
    if (this.zooming && e.target === this.image.el) {
      this.handleImageZoomEnd(e)
    } else {
      this.handleWrapPointerEnd(e)
    }
  }

  onClick (e) {
    if (e.target === this.image.el) {
      let now = Date.now()
      if (now - this.lastClickTime < 400) {
        if (this.moving) return
        if (this.zooming) {
          this.zoom(this.image.oldRatio)
          this.zooming = false
        } else {
          this.zoom(1)
          this.zooming = true
        }
        // removeClass(this.image.el, 'viewer-image-zoom')
      }
      this.lastClickTime = now
    }
  }

  zoom (ratio) {
    addClass(this.image.el, 'viewer-image-zoom')
    const {
      naturalWidth,
      naturalHeight,
      width,
      height,
      top,
      left
    } = this.image

    const newWidth = naturalWidth * ratio
    const newHeight = naturalHeight * ratio
    const offsetWidth = newWidth - width
    const offsetHeight = newHeight - height
    const oldRatio = width / naturalWidth

    this.image.width = newWidth
    this.image.height = newHeight
    this.image.left -= offsetWidth / 2
    this.image.top -= offsetHeight / 2
    this.image.oldRatio = oldRatio
    this.image.reset()
  }

  handleWrapPointerStart (e) {
    const touch = e.targetTouches
    if (touch && touch.length === 1) {
      this.touch.pageX = touch[0].pageX
      this.touch.pageY = touch[0].pageY
    }
  }
  handleWrapPointerMove (e) {
    const touch = e.targetTouches
    const { currentLeft } = this.touch
    let diff = touch[0].pageX - this.touch.pageX
    setStyle(this.viewer.el, {
      transform: `translate3d(${currentLeft + diff}px, 0, 0)`,
      transitionDuration: '0ms'
    })
    this.touch.diff = diff
  }
  handleWrapPointerEnd (e) {
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
      this.image = this.images[touch.currentIndex]
      touch.currentLeft = left
    }
    touch.diff = 0
  }
  handleImageZoomStart (e) {
    const touch = e.targetTouches
    if (touch && touch.length === 1) {
      this.imageZoom.left = touch[0].pageX
      this.imageZoom.top = touch[0].pageY
    }
  }
  handleImageZoomMove (e) {}
  handleImageZoomEnd (e) {}
  
}