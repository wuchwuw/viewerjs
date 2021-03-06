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

export function getTouches (e, currentTouches, ids, targetEl) {
  if (currentTouches.length >= 2) return
  let target = e.targetTouches
  let i = 0
  while (i < target.length) {
    if (currentTouches.length === 2) return
    const id = target[i].identifier
    const touch = target[i]
    if (!ids.has(id) && touch.target === targetEl) {
      currentTouches.push(touch)
      ids.add(id)
    }
    i++
  }
}


export function collectTouches (e, currentTouches, ids) {
  let changed = e.targetTouches
  ids.forEach(id => {
    let i = 0
    while (i < changed.length) {
      if (id === changed[i].identifier) {
        currentTouches.splice(i, 1, changed[i])
      }
      i ++
    }
  })
}

export function removeTouches (e, currentTouches, ids) {
  let changed = e.changedTouches
  let i = 0
  while (i < changed.length) {
    let id = changed[i].identifier
    let index = currentTouches.findIndex(touch => touch.identifier === id)
    if (index > -1) {
      currentTouches.splice(index, 1)
      ids.delete(id)
    }
    i++
  }
}