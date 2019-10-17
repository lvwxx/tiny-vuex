const { initMiddleware, execMiddleware } = require('./middleware')
const { deepClone } = require('../utils/index')
const { initProxy } = require('./proxy')

class Store {
  constructor({ state, mutations, actions }) {
    this._committing = false
    this._mutations = {}
    this._actions = {}
    this._callbacks = []
    this._init(state, mutations, actions)
    this._initMiddleware()
  }
}

initStore(Store)
initMiddleware(Store)

Store.prototype.getStatus = function () {
  return this._state
}

Store.prototype.subscribe = function (callback) {
  this._callbacks.push(callback)
}

Store.prototype.dispatch = function (actionName, payload) {
  return new Promise((resolve, reject) => {
    const action = this._actions[actionName]
    const self = this
    action(payload).then(() => {
      resolve(this._state)
    })
  })
}

Store.prototype.commit = function (mutationName, payload) {
  const mutation = this._mutations[mutationName]
  const state = deepClone(this.getStatus())
  execMiddleware(this)
  this._committing = true
  mutation(payload)
  this._committing = false
  Promise.resolve().then(() => {
    this._callbacks.forEach(callback => {
      callback(state, this._state)
    })
  })
}

function initStore(Store) {
  Store.prototype._init = function (state, mutations, actions) {
    initMutation(this, mutations, state)
    initAction(this, actions)
    this._state = initProxy(this, state)
  }
}

function initMutation(store, mutations, state) {
  const keys = Object.keys(mutations)
  keys.forEach(key => {
    registerMutation(key, store, mutations[key], state)
  })
}

function registerMutation(key, store, handle, state) {
  store._mutations[key] = function (data) {
    handle.call(store, state, data)
  }
}

function initAction(store, actions) {
  const keys = Object.keys(actions)

  keys.forEach(key => {
    registerAction(key, store, actions[key])
  })
}

function registerAction(key, store, handle) {
  store._actions[key] = function (data) {
    let res = handle.call(store, { commit: store.commit.bind(store), state: store._state }, data)
    return res
  }
}

module.exports = {
  Store
}