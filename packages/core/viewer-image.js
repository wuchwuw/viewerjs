import { addClass, setStyle } from '../helpers/dom'

export default class ViewerImage {
  constructor (image, index, viewer) {
    const { width: viewerWidth, height: viewerHeight, el } = viewer
    // init render 
    this.naturalWidth = image.naturalWidth
    this.naturalHeight = image.naturalHeight
    this.radio = image.naturalWidth / image.naturalHeight
    this.src = image.src
    this.width = viewerWidth
    this.height = viewerHeight
    this.index = index

    if (image.naturalHeight * this.radio > viewerWidth) {
      this.height = viewerWidth / this.radio
    } else {
      this.width = viewerHeight * this.radio
    }

    this.width = Math.min(this.width, viewerWidth * 0.9)
    this.height = Math.min(this.height, viewerHeight * 0.9)

    this.left = (viewerWidth - this.width) / 2
    this.right = (viewerHeight - this.height) / 2

    this.renderImage(viewer, index)
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
    setStyle(img, {
      width: this.width + 'px',
      height: this.height + 'px',
      transform: `translate3d(${this.left}px, ${this.right}px, 0)`
    })
    wrap.appendChild(img)
    let container = viewer.el.querySelector('.viewer-wrap')
    container.appendChild(wrap)
  }
}