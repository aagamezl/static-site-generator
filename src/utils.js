const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]'
}

const titleCase = (value) => {
  return `${value.charAt(0).toUpperCase()}${value.substr(1).toLowerCase()}`
}

module.exports = {
  isObject,
  titleCase
}
