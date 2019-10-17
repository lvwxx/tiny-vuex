const { Store } = require('../src/index')
const axios = require('axios')

const state = {
  name: 'w',
  age: 12,
  data: {}
}

const mutations = {
  changeAge(state, data) {
    state.age = data
  },
  changeData(state, data) {
    state.data = data
  }
}

const actions = {
  async getData({ commit }) {
    const data = await axios.get('http://ip-api.com/json')
    commit('changeData', data.data.status)
  }
}

const store = new Store({
  state,
  mutations,
  actions
})

store.$middlewares.use(async next => {
  //console.log('start middleware 1')
  await next()
  //console.log('end middleware 1')
})


// store.subscribe(function (oldState, newState) {
//   console.log(oldState)
//   console.log(newState)
// })
store.dispatch('getData').then(state => {
  console.log('dispatch success', state)
})
// store.commit('changeAge', 133)
// console.log(store.getStatus())
