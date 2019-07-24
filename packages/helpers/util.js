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
      if (callback.call(value, value[i], i, value) === false) {
        break
      }
    } else if (isObject(value)) {
      Object.keys(value).forEach(key => {
        callback.call(value, value[key], i, value)
      })
    }
  }
}