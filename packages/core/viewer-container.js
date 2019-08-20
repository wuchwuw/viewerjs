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
    this.show = false

    this.init()
    this.initEvent()
  }

  init () {
    let container = document.createElement('div')
    addClass(container, 'viewer-container')
    container.innerHTML = TEMPLATE
    this.parent.appendChild(container)

    this.el = container
  }

  initEvent () {
    const { el } = this
    addEventListener(el, this.transitionEnd.bind(this))
  }

  show () {
    this.show = true
    addClass(el, 'viewer-show')
    addClass(el, 'viewer-fade-in')
  }

  hide () {
    removeClass(el, 'viewer-fade-in')
  }

  transitionEnd () {
    const { el } = this
    if (this.show) {
      removeClass(el, 'viewer-show')
      this.show = false
    }
  }
}