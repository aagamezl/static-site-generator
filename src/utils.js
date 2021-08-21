const fs = require('fs')
const path = require('path')

const { format } = require('@devnetic/cli')

const getConfig = (configPath, parse = true) => {
  try {
    configPath = configPath || path.resolve(process.cwd(), './config.json')
    const config = fs.readFileSync(configPath, 'utf8')

    return parse === true ? JSON.parse(config) : config
  } catch (error) {
    const message = format.bold().red

    console.log(message('Config file not found, please create a site with `ssg -n`'))

    process.exit(1)
  }
}

const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]'
}

const titleCase = (value) => {
  return `${value.charAt(0).toUpperCase()}${value.substr(1).toLowerCase()}`
}

module.exports = {
  getConfig,
  isObject,
  titleCase
}
