function deepClone(obj) {
  const keys = Object.keys(obj)
  const res = {}

  for (let key of keys) {
    if (type(obj[key]) === '[object Object]') {
      res[key] = deepClone(obj[key])
    } else {
      res[key] = obj[key]
    }
  }

  return res
}

function type(v) {
  return Object.prototype.toString.call(v)
}

module.exports = {
  deepClone
}