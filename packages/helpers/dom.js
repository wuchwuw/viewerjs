import { forEach } from './util'

export function addClass (element, className) {
  console.log(element)
  if (element.classList) {
    element.classList.add(className)
  } else {
    let classNames = element.className
    console.log(classNames)
    if (classNames.indexOf(className) < 0) {
      element.className = `${classNames} ${className}`
    }
  }
}

export function removeClass (element, className) {
  if (element.classList) {
    element.classList.remove(className)
  } else {
    let classNames = element.className.trim()
    if (classNames.indexOf(className) > -1) {
      classNames.replace(className, '')
      element.className = `${classNames}`
    }
  }
}

export function setStyle (element, styles) {

}