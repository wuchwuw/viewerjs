import TEMPLATE from '../shared/template'

import {
  addClass,
  setStyle,
  removeClass,
  hasClass,
  addEventListener
} from '../helpers/dom'

export default class ViewerContainer {
  constructor () {
    this.parent = document.body
    this.el = null
    this.closeEl = null
    this.display = false

    this.init()
    this.initEvent()
  }

  init () {
    let container = document.createElement('div')
    addClass(container, 'viewer-container')
    container.innerHTML = TEMPLATE
    this.parent.appendChild(container)

    this.el = container
    this.closeEl = container.querySelector('.viewer-close')
  }

  initEvent () {
    const { el, closeEl } = this
    addEventListener(el, 'transitionend', this.transitionEnd.bind(this))
    addEventListener(closeEl, 'click', this.hide.bind(this))
  }

  show () {
    const { el, parent } = this
    addClass(el, 'viewer-show')
    addClass(parent, 'viewer-open')
    setTimeout(() => {
      addClass(el, 'viewer-fade-in')
      this.display = true
    }, 20)
  }

  hide () {
    const { el } = this
    removeClass(el, 'viewer-fade-in')
    this.display = false
  }

  transitionEnd () {
    const { el } = this
    if (!this.display) {
      removeClass(el, 'viewer-show')
    }
  }
}