const fs = require('fs')
const path = require('path')

const { format } = require('@devnetic/cli')

const { THEMES_PATH } = require('./constants')

/**
 * Get the site config.
 *
 * @param {string} configPath
 * @param {boolean} [parse=true]
 * @return {object}
 */
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

/**
 * Get the path relative to the project directory.  The function can receive a
 * set of paths and with contatenate them.
 *
 * @param {Array} paths
 * @return {string}
 */
const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
}

/**
 * Get a glob pattern from the given items.
 *
 * @param {Array<string>} items
 * @return {string}
 */
const getGlobPattern = (items) => {
  const normalized = items.reduce((pattern, item) => {
    if (item.startsWith('.')) {
      return pattern.concat(item.slice(1))
    }

    return pattern.concat(item)
  }, [])

  return `**/*.{${normalized.join(',')}}`
}

/**
 * Get the export path for the given file.
 *
 * @param {string} filename
 * @param {object} config
 * @return {string}
 */
const getExportPath = (filename, config) => {
  const separator = path.sep

  const exportPath = filename.replace(process.cwd(), '')
    .replace(`${separator}${THEMES_PATH}`, '')
    .replace(`${separator}${config.theme}`, '')

  return getPath(config.build, exportPath)
}

/**
 * Verify if the given file is a asset file.
 *
 * @param {Array<string>} assets
 * @param {string} filename
 * @return {boolean}
 */
const isAssetFile = (assets, filename) => {
  return assets.includes(path.extname(filename))
}

/**
 * Verify if the given file is a content file.
 *
 * @param {string} filename
 * @return {boolean}
 */
const isContentFile = (filename) => {
  const separator = path.sep

  return filename.replace(process.cwd(), '').startsWith(`${separator}content`)
}

/**
 * Verify if the value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * Convert the given value to title case.
 *
 * @param {string} value
 * @return {string}
 */
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
