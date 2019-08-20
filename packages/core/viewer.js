import ViewerImage from './viewer-image'
import {
  addClass,
  setStyle,
  removeClass,
  addEventListener
} from '../helpers/dom'

import ViewerContainer from './viewer-container'

import {
  getPointersCenter
} from '../helpers/util'

export default class Viewer {
  constructor (source, options) {
    this.images = []
    this.zooming = false
    this.zoomMoving = false
    this.moving = false
    this.isDbClick = false
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
      diffX: 0,
      diffY: 0,
      pageX: 0,
      pageY: 0,
      pointer: {}
    }
    this.container = new ViewerContainer()
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
    const { el: container } = this.container
    this.viewer.el = container.querySelector('.viewer-wrap')
    addEventListener(this.viewer.el, 'touchstart', this.onTouchStart.bind(this))
    addEventListener(this.viewer.el, 'touchmove', this.onTouchMove.bind(this))
    addEventListener(this.viewer.el, 'touchend', this.onTouchEnd.bind(this))
    addEventListener(this.viewer.el, 'click', this.onClick.bind(this))
  }

  show () {
    const { container } = this
    console.log(container)
    container.show()
  }

  hide () {
    const { container } = this
    container.hide()
  }

  onTouchStart (e) {
    console.log(e)
    if (!this.zooming) {
      this.handleWrapPointerStart(e)
    } else if (this.zooming && e.target === this.image.el) {
      this.handleImageZoomStart(e)
    }
  }

  onTouchMove (e) {
    if (!this.zooming) {
      this.handleWrapPointerMove(e)
    } else if (e.target === this.image.el) {
      this.handleImageZoomMove(e)
    }
  }

  onTouchEnd (e) {
    if (!this.zooming) {
      this.handleWrapPointerEnd(e)
    } else if (e.target === this.image.el) {
      this.handleImageZoomEnd(e)
    }
  }

  onClick (e) {
    // ios div pointer

    //todo handle pointer
    let pointer = [{
      pageX: e.pageX,
      pageY: e.pageY
    }]
    if (e.target === this.image.el) {
      let now = Date.now()
      if (now - this.lastClickTime < 300) {
        this.isDbClick = true
        if (this.moving) return
        if (this.zooming) {
          this.zoom(this.image.oldRatio, this.imageZoom.pointer)
          this.zooming = false
        } else {
          this.zoom(2, (this.imageZoom.pointer = pointer))
          this.zooming = true
        }
      }
      this.lastClickTime = now
      this.isDbClick = false
    }
  }

  zoom (ratio, pointers) {
    addClass(this.image.el, 'viewer-image-zoom')
    const {
      naturalWidth,
      naturalHeight,
      width,
      height,
      left,
      top
    } = this.image

    const newWidth = naturalWidth * ratio
    const newHeight = naturalHeight * ratio
    const offsetWidth = newWidth - width
    const offsetHeight = newHeight - height
    const oldRatio = width / naturalWidth

    if (pointers) {
      // todo bugfix imageZoom.left image.left
      const center = getPointersCenter(pointers)
      this.image.left -= offsetWidth * (center.pageX - left) / width
      this.image.top -= offsetHeight * (center.pageY - top) / height
    } else {
      this.image.left -= offsetWidth / 2
      this.image.top -= offsetHeight / 2
    }
    this.image.oldRatio = oldRatio
    this.image.width = newWidth
    this.image.height = newHeight
    
    this.imageZoom.left = this.image.left
    this.imageZoom.top = this.image.top

    // setStyle(this.image.el, {
    //   width: this.image.width + 'px',
    //   height: this.image.height + 'px',
    //   transform: `translate3d(${this.image.left}px, ${this.image.top}px) scale(${ratio})`
    // })
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
      this.imageZoom.pageX = touch[0].pageX
      this.imageZoom.pageY = touch[0].pageY

      // init zoom left,top
      // this.imageZoom.left = this.image.left
      // this.imageZoom.top = this.image.top
    }
  }

  handleImageZoomMove (e) {

    this.zoomMoving = true

    const touch = e.targetTouches
    const {
      left,
      top,
      pageX,
      pageY
    } = this.imageZoom
    let newDiffX = touch[0].pageX - pageX
    let newDiffY = touch[0].pageY - pageY
    let newLeft = left + newDiffX
    let newTop = top + newDiffY
    setStyle(this.image.el, {
      transform: `translate3d(${newLeft}px, ${newTop}px, 0)`,
      transitionDuration: '0ms'
    })
    this.imageZoom.diffX = newDiffX
    this.imageZoom.diffY = newDiffY
    this.imageZoom.left = newLeft
    this.imageZoom.top = newTop
    this.imageZoom.pageX = touch[0].pageX
    this.imageZoom.pageY = touch[0].pageY

    // this.image.left = newLeft
    // this.image.top = newTop
  }
  handleImageZoomEnd (e) {
    if (!this.zoomMoving) {
      return
    }
    this.zoomMoving = true
    const {
      width: viewerWidth,
      height: viewerHeight
    } = this.viewer
    const {
      width: imageWidth,
      height: imageHeight,
      left: imageLeft,
      top: imageTop
    } = this.image

    // 移动范围
    // topMax -> 0 -> topMin
    // leftMax -> 0 -> leftMin
    const isWidthOverflow = imageWidth > viewerWidth
    const isHeightOverflow = imageHeight > viewerHeight
    const topMax = isHeightOverflow ? (viewerHeight - imageHeight) : imageTop
    const leftMax = isWidthOverflow ? (viewerWidth - imageWidth) : imageLeft
    const topMin = isHeightOverflow ? 0 : imageTop
    const leftMin = isWidthOverflow ? 0 : imageLeft

    const {
      left: zoomLeft,
      top: zoomTop
    } = this.imageZoom

    let newZoomLeft = Math.min(Math.max(zoomLeft, leftMax), leftMin)
    let newZoomTop = Math.min(Math.max(zoomTop, topMax), topMin)

    setStyle(this.image.el, {
      transform: `translate3d(${newZoomLeft}px, ${newZoomTop}px, 0)`,
      transitionDuration: '500ms'
    })

    this.imageZoom.left = newZoomLeft
    this.imageZoom.top = newZoomTop
  }
  
}