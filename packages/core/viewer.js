import ViewerImage from './viewer-image'
import {
  addClass,
  setStyle,
  removeClass,
  addEventListener
} from '../helpers/dom'

import {
  getDist,
  getPointersCenter,
  damping
} from '../helpers/util'

import ViewerContainer from './viewer-container'

import {
  MARGIN
} from '../shared/constants'

export default class Viewer {
  constructor (source, options) {
    this.images = []
    this.zooming = false
    this.zoomMoving = false
    this.lastClickTime = 0
    this.mutipleZooming = false
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
    this.mutipleZoom = {
      diffX: 0,
      diffY: 0,
      dist: 0
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
    this.viewer.contentWidth = this.viewer.width * this.images.length + (this.images.length - 1) * MARGIN
    console.log(this.viewer.contentWidth)
    this.image = this.images[this.touch.currentIndex]
  }

  initViewer () {
    const { el: container } = this.container
    this.viewer.el = container.querySelector('.viewer-wrap')
    addEventListener(this.viewer.el, 'touchstart', this.onTouchStart.bind(this))
    addEventListener(this.viewer.el, 'touchmove', this.onTouchMove.bind(this))
    addEventListener(this.viewer.el, 'touchend', this.onTouchEnd.bind(this))
    addEventListener(this.viewer.el, 'click', this.onClick.bind(this))
    // addEventListener(window, 'gesturestart', (e) => { e.preventDefault() })
    // addEventListener(window, 'gesturemove', (e) => { e.preventDefault() })
    // addEventListener(window, 'gestureend', (e) => { e.preventDefault() })
  }

  show () {
    const { container } = this
    container.show()
  }

  hide () {
    const { container } = this
    container.hide()
  }

  onTouchStart (e) {
    // if (!this.zooming) {
    //   if (e.target === this.image.el) {
    //     if (e.touches.length <= 1) {
    //       this.handleWrapPointerStart(e)
    //     } else {
    //       this.handleMutipleZoomStart(e)
    //     }
    //   }
    // } else if (e.target === this.image.el) {
    //   this.handleImageZoomStart(e)
    // }
    if (e.touches.length <= 1) {
      if ((this.zooming || this.mutipleZooming) && e.target === this.image.el) {
        this.handleImageZoomStart(e)
      } else if (!this.zooming && !this.mutipleZooming){
        this.handleWrapPointerStart(e)
      }
    } else if (e.target === this.image.el) {
      this.handleMutipleZoomStart(e)
    }
  }

  onTouchMove (e) {
    // if (!this.zooming) {
    //   if (e.target === this.image.el) {
    //     if (e.touches.length <= 1) {
    //       this.handleWrapPointerMove(e)
    //     } else {
    //       this.handleMutipleZoomMove(e)
    //     }
    //   }
    // } else if (e.target === this.image.el) {
    //   this.handleImageZoomMove(e)
    // }
    if (e.touches.length <= 1) {
      if ((this.zooming || this.mutipleZooming) && e.target === this.image.el) {
        this.handleImageZoomMove(e)
      } else if (!this.zooming && !this.mutipleZooming){
        this.handleWrapPointerMove(e)
      }
    } else if (e.target === this.image.el) {
      this.handleMutipleZoomMove(e)
    }
  }

  onTouchEnd (e) {
    // alert(e.touches.length)
    // alert(e.changedTouches.length)
    // alert(e.targetTouches.length)
    // alert(e.changedTouches.length)
    // if (!this.zooming) {
    //   if (e.target === this.image.el) {
    //     if (e.changedTouches.length <= 1 && !this.mutipleZooming) {
    //       this.handleWrapPointerEnd(e)
    //     } else {
    //       this.handleMutipleZoomEnd(e)
    //     }
    //   }
    // } else if (e.target === this.image.el) {
    //   this.handleImageZoomEnd(e)
    // }

    // if (e.changedTouches.length <= 1) {
    //   if ((this.zooming || this.mutipleZooming) && e.target === this.image.el) {
    //     this.handleImageZoomEnd(e)
    //   } else if (!this.zooming && !this.mutipleZooming){
    //     this.handleWrapPointerEnd(e)
    //   }
    // } else if (e.target === this.image.el) {
    //   this.handleMutipleZoomEnd(e)
    // }

    if (this.zooming) {
      this.handleImageZoomEnd(e)
    } else if (this.mutipleZooming) {
      this.handleMutipleZoomEnd(e)
    } else {
      this.handleWrapPointerEnd(e)
    }
  }

  onClick (e) {
    if (this.image.transitioning) return
    // ios div pointer

    //todo handle pointer
    let pointer = [{
      pageX: e.pageX,
      pageY: e.pageY
    }]
    if (e.target === this.image.el) {
      let now = Date.now()
      if (now - this.lastClickTime < 300) {
        if (this.zoomMoving) return
        if (this.zooming) {
          this.zoom(this.image.oldRatio, this.imageZoom.pointer)
          this.zooming = false
        } else {
          this.zoom(2, (this.imageZoom.pointer = pointer))
          this.zooming = true
        }
      }
      this.lastClickTime = now
    }
  }

  handleMutipleZoomStart (e) {
    removeClass(this.image.el, 'viewer-image-zoom')
    this.mutipleZooming = true
    let pointers = e.targetTouches
    let pointer1 = pointers[0]
    let pointer2 = pointers[1]

    let diffX = Math.abs(pointer1.pageX - pointer2.pageX)
    let diffY = Math.abs(pointer1.pageY - pointer2.pageY)

    this.mutipleZoom.dist = getDist(diffX, diffY)
    this.mutipleZoom.diff = this.mutipleZoom.dist - 0
  }

  handleMutipleZoomMove (e) {
    removeClass(this.image.el, 'viewer-image-zoom')
    let pointers = e.targetTouches
    let pointer1 = pointers[0]
    let pointer2 = pointers[1]

    let diffX = Math.abs(pointer1.pageX - pointer2.pageX)
    let diffY = Math.abs(pointer1.pageY - pointer2.pageY)

    let dist = getDist(diffX, diffY)
    let diff = dist - this.mutipleZoom.diff

    const {
      width,
      height,
      left,
      top
    } = this.image

    let newWidth = diff + width
    let newHeight = diff + height

    const center = getPointersCenter(pointers)
    let newLeft = left - diff * (center.pageX - left) / width
    let newTop = top - diff * (center.pageY - top) / height

    this.mutipleZoom.width = newWidth
    this.mutipleZoom.height = newHeight
    this.mutipleZoom.left = newLeft
    this.mutipleZoom.top = newTop

    setStyle(this.image.el, {
      width: newWidth + 'px',
      height: newHeight + 'px',
      marginLeft: newLeft + 'px',
      marginTop: newTop + 'px'
    })
  }

  handleMutipleZoomEnd (e) {
    addClass(this.image.el, 'viewer-image-zoom')
    this.mutipleZooming = false

    const {
      init
    } = this.image

    if (this.mutipleZoom.width < init.width || this.mutipleZoom.height < init.height) {
      this.image.width = init.width
      this.image.height = init.height
      this.image.left = init.left
      this.image.top = init.top

      this.image.reset()
    } else {
      this.image.width = this.mutipleZoom.width
      this.image.height = this.mutipleZoom.height
      this.image.left = this.mutipleZoom.left
      this.image.top = this.mutipleZoom.top
    }
  }

  zoom (ratio, pointers) {
    addClass(this.image.el, 'viewer-image-zoom')
    // setStyle(this.image.el, {
    //   'willChange': 'transform'
    // })
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
    this.image.oldRatio = Number((width / naturalWidth).toFixed(2))

    if (pointers) {
      // todo bugfix imageZoom.left image.left
      const center = getPointersCenter(pointers)
      this.image.left -= offsetWidth * (center.pageX - left) / width
      this.image.top -= offsetHeight * (center.pageY - top) / height
    } else {
      this.image.left -= offsetWidth / 2
      this.image.top -= offsetHeight / 2
    }
    this.image.width = newWidth
    this.image.height = newHeight
    
    this.imageZoom.left = this.image.left
    this.imageZoom.top = this.image.top

    // setStyle(this.image.el, {
    //   width: this.image.width + 'px',
    //   height: this.image.height + 'px',
    //   transform: `translate3d(${this.image.left}px, ${this.image.top}px) scale(${ratio})`
    // })
    requestAnimationFrame(() => {
      this.image.reset()
    })
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
    const { contentWidth } = this.viewer
    let diff = touch[0].pageX - this.touch.pageX
    let left = currentLeft + diff
    let absLeft = Math.abs(left)
    if (left > 0) {
      left = damping(left)
    } else if (absLeft > contentWidth - 375) {
      console.log(absLeft - contentWidth - 375)
      let d = damping(absLeft - contentWidth - 375)
      left = left - d
    }
    setStyle(this.viewer.el, {
      transform: `translate3d(${left}px, 0, 0)`,
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
        let index = Math.ceil(absLeft / transformWidth)
        left = index * -transformWidth - MARGIN * index
        touch.currentIndex = index
        setStyle(el, {
          transform: `translate3d(${left}px, 0, 0)`,
          transitionDuration: '300ms'
        })
      } else {
        let index = Math.floor(absLeft / transformWidth)
        left = index * -transformWidth - MARGIN * index
        touch.currentIndex = index
        setStyle(el, {
          transform: `translate3d(${left}px, 0, 0)`,
          transitionDuration: '300ms'
        })
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
    }
  }

  handleImageZoomMove (e) {
    removeClass(this.image.el, 'viewer-image-zoom')
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
    // setStyle(this.image.el, {
    //   transform: `translate3d(${newLeft}px, ${newTop}px, 0)`,
    //   transitionDuration: '0ms'
    // })
    requestAnimationFrame(() => {
      setStyle(this.image.el, {
        marginLeft: newLeft + 'px',
        marginTop: newTop + 'px'
      })
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
    addClass(this.image.el, 'viewer-image-zoom')
    if (!this.zoomMoving) {
      return
    }

    this.zoomMoving = false

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

    // setStyle(this.image.el, {
    //   transform: `translate3d(${newZoomLeft}px, ${newZoomTop}px, 0)`,
    //   transitionDuration: '500ms'
    // })

    this.imageZoom.left = newZoomLeft
    this.imageZoom.top = newZoomTop

    requestAnimationFrame(() => {
      this.image.move(this.imageZoom.left, this.imageZoom.top)
    })
  }
  
}