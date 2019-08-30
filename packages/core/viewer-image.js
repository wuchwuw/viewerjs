import { 
  addClass,
  setStyle,
  addEventListener
} from '../helpers/dom'

export default class ViewerImage {
  constructor (image, index, viewer) {
    const { width: viewerWidth, height: viewerHeight } = viewer
    // init render
    this.getImageNaturalSize(image, (image) => {
      this.naturalWidth = image.naturalWidth
      this.naturalHeight = image.naturalHeight
      this.radio = image.naturalWidth / image.naturalHeight
      this.oldRatio = image.naturalWidth / image.naturalHeight
      this.src = image.src
      this.width = viewerWidth
      this.height = viewerHeight
      this.index = index
      this.transitioning = false
      this.el = null

      if (image.naturalHeight * this.radio > viewerWidth) {
        this.height = viewerWidth / this.radio
      } else {
        this.width = viewerHeight * this.radio
      }

      this.width = Math.min(this.width, viewerWidth)
      this.height = Math.min(this.height, viewerHeight)

      this.left = (viewerWidth - this.width) / 2
      this.top = (viewerHeight - this.height) / 2

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
      transform: `translate3d(${index * viewer.width}px, 0, 0)`
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

  move (left, top) {
    setStyle(this.el, {
      marginLeft: left + 'px',
      marginTop: top + 'px'
    })
  }
}