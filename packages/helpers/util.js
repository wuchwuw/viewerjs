export function isObject (value) {
  return typeof value === 'object' && value !== null
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
}

export function forEach (value, callback) {
  if (value && isFunction(callback)) {
    if (Array.isArray(value) && isNumber(value.length)) {
      let length = value.length
      for (let i = 0; i < length; i++) {
        if (callback.call(value, value[i], i, value) === false) {
          break
        }
      }
    } else if (isObject(value)) {
      Object.keys(value).forEach(key => {
        callback.call(value, value[key], key, value)
      })
    }
  }
}

export function getPointersCenter (pointers) {
  let pageX = 0
  let pageY = 0
  let count = 0

  forEach(pointers, (pointer) => {
    pageX += pointer.pageX
    pageY += pointer.pageY
    count ++
  })

  pageX /= count
  pageY /= count

  return {
    pageX,
    pageY
  }
}

export function getDist (x, y) {
  return Math.sqrt(x * x + y * y)
}