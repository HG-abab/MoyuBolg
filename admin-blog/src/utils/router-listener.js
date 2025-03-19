import mitt from 'mitt'

const emitter = mitt()
// 唯一标识
const key = Symbol('ROUTE_CHANGE')

let latestRoute = null

export function setRouteEmitter(to) {
  emitter.emit(key, to)
  latestRoute = to
}

export function listenerRouteChange(handler, immediate = true) {
  emitter.on(key, handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

// 移出所以通过key注册的事件
export function removeRouteListener() {
  emitter.off(key)
}
