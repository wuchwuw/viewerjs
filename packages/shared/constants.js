export const IS_BROWSER = typeof window !== 'undefined'
export const WINDOW = IS_BROWSER ? window : {}
export const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false
export const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false

// Events
export const EVENT_CLICK = 'click'
export const EVENT_DBLCLICK = 'dblclick'
export const EVENT_DRAG_START = 'dragstart'
export const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
export const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
export const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup'

export const MARGIN = 30

export const MIN_TRANSFORM_DIFF = 100