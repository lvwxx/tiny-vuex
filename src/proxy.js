function initProxy(store,state) {
  return new Proxy(state, handle(store))
}

function handle(store) {
  return {
    get: function (target, key) {
      return Reflect.get(target, key)
    },
    set: function (target, key, value) {
      if (!store._committing) {
        throw new Error('只能通过 mutation 更改 state')
      }
      return Reflect.set(target, key, value)
    }
  }
}

module.exports = {
  initProxy
}