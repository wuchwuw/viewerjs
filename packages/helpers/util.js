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

export function damping (value) {
  var step = [20, 40, 60, 80, 100]
  var rate = [0.5, 0.4, 0.3, 0.2, 0.1]

  var scaleedValue = value
  var valueStepIndex = step.length

  while (valueStepIndex--) {
    if (value > step[valueStepIndex]) {
      scaleedValue = (value - step[valueStepIndex]) * rate[valueStepIndex]
      for (var i = valueStepIndex; i > 0; i--) {
        scaleedValue += (step[i] - step[i - 1]) * rate[i - 1]
      }
      scaleedValue += step[0] * 1
      break
    }
  }

  return scaleedValue
}

export function getOverflow (min, max, value) {
  debugger
  if ((min > value &&  max < value) || (min === value && max === value)) {
    return value
  }
  let diff
  if (min > value) {
    diff = min - value
    diff = damping(diff)
    return min + diff
  } else if (max < value) {
    diff = value - max
    diff = damping(diff)
    return max + diff
  }
}