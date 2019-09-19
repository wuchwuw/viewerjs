import { 
  addClass,
  setStyle,
  addEventListener
} from '../helpers/dom'

import {
  MARGIN
} from '../shared/constants'

export default class ViewerImage {
  constructor (image, index, viewer) {
    const { width: viewerWidth, height: viewerHeight } = viewer
    // init render
    this.getImageNaturalSize(image, (image) => {
      this.naturalWidth = image.naturalWidth
      this.naturalHeight = image.naturalHeight
      this.ratio = image.naturalWidth / image.naturalHeight
      this.src = image.src
      this.width = viewerWidth
      this.height = viewerHeight
      this.index = index
      this.transitioning = false
      this.el = null

      if (image.naturalHeight * this.ratio > viewerWidth) {
        this.height = viewerWidth / this.ratio
      } else {
        this.width = viewerHeight * this.ratio
      }

      this.width = Math.min(this.width, viewerWidth)
      this.height = Math.min(this.height, viewerHeight)

      this.scale = this.width / image.naturalHeight

      this.left = (viewerWidth - this.width) / 2
      this.top = (viewerHeight - this.height) / 2

      this.init = {
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top
      }

      this.renderImage(viewer, index)
      this.initEvent()
    })
  }

  initEvent () {
    addEventListener(this.el, 'transitionend', () => {
      this.transitioning = false
      console.log(`${this.index}:${this.transitioning}`)
    })
    addEventListener(this.el, 'transitionstart', () => {
      this.transitioning = true
      console.log(`${this.index}:${this.transitioning}`)
    })
  }

  getImageNaturalSize (image, cb) {
    if (image.complete) {
      cb(image)
    } else {
      let newImage = document.createElement('img')
      newImage.src = image.src
      newImage.onload = () => {
        cb(newImage)
      }
    }
  }

  renderImage (viewer, index) {
    let wrap = document.createElement('div')
    addClass(wrap, 'viewer-image-wrap')
    setStyle(wrap, {
      width: viewer.width + 'px',
      height: viewer.height + 'px',
      transform: `translate3d(${index * viewer.width + MARGIN * index}px, 0, 0)`
    })
    const img = document.createElement('img')
    img.src = this.src
    wrap.appendChild(img)
    viewer.el.appendChild(wrap)
    this.el = img
    this.reset()
    // addEventListener(img, 'click', this.onClick.bind(this))
  }

  reset () {
    setStyle(this.el, {
      width: this.width + 'px',
      height: this.height + 'px',
      marginLeft: this.left + 'px',
      marginTop: this.top + 'px'
    })
  }

  resetInit () {
    this.width = this.init.width
    this.height = this.init.height
    this.left = this.init.left
    this.top = this.init.top
    addClass(this.el, 'viewer-image-zoom')
    setStyle(this.el, {
      width: this.width + 'px',
      height: this.height + 'px',
      marginLeft: this.left + 'px',
      marginTop: this.top + 'px'
    })
  }

  move (left, top) {
    // todo requestAnimationFrame
    setStyle(this.el, {
      marginLeft: left + 'px',
      marginTop: top + 'px'
    })
  }
}