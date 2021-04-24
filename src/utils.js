const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]'
}

module.exports = {
  isObject
}
