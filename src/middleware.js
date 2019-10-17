class Middleware {
  constructor() {
    this.middlewares = []
    this.index = 0
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  exec() {
    this.next()
  }

  next() {
    if (this.index < this.middlewares.length) {
      const middleware = this.middlewares[this.index]
      this.index++
      middleware.call(this, this.next.bind(this))
    } else {
      this.index = 0
    }
  }
}

function initMiddleware(Store) {
  Store.prototype._initMiddleware = function () {
    const store = this
    store.$middlewares = new Middleware()
  }
}

function execMiddleware(store) {
  const m = store.$middlewares
  if (m.middlewares.length) {
    m.exec()
  }
}


module.exports = {
  initMiddleware,
  execMiddleware
}