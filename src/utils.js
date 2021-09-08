const fs = require('fs')
const path = require('path')

const { format } = require('@devnetic/cli')

const { THEMES_PATH } = require('./constants')

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

const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
}

const getGlobPattern = (items) => {
  const normalized = items.reduce((pattern, item) => {
    if (item.startsWith('.')) {
      return pattern.concat(item.slice(1))
    }

    return pattern.concat(item)
  }, [])

  return `**/*.{${normalized.join(',')}}`
}

const getExportPath = (filename, config) => {
  const separator = path.sep

  const exportPath = filename.replace(process.cwd(), '')
    .replace(`${separator}${THEMES_PATH}`, '')
    .replace(`${separator}${config.theme}`, '')

  return getPath(config.build, exportPath)
}

const isAssetFile = (assets, filename) => {
  return assets.includes(path.extname(filename))
}

const isContentFile = (filename) => {
  const separator = path.sep

  return filename.replace(process.cwd(), '').startsWith(`${separator}content`)
}

const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]'
}

const titleCase = (value) => {
  return `${value.charAt(0).toUpperCase()}${value.substr(1).toLowerCase()}`
}

module.exports = {
  getConfig,
  getExportPath,
  getGlobPattern,
  getPath,
  isAssetFile,
  isContentFile,
  isObject,
  titleCase
}
