const path = require('path')

const glob = require('glob')
const handlebars = require('./handlebars')

const templateSystems = new Map()

/**
 * Get a registered template system by name
 *
 * @param {string} name
 * @return {object}
 */
const getSystem = (name) => {
  return templateSystems.get(name)
}

/**
 * Import all template systems from a directory
 *
 * @param {string} pattern
 * @param {string} directory
 * @return {Promise<object[]>}
 */
const importSystems = (pattern, directory) => {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: directory }, (error, files) => {
      if (error) {
        reject(error)
      }

      const imports = []
      for (const file of files) {
        imports.push(require(path.resolve(directory, file)))
      }

      resolve(imports)
    })
  })
}

/**
 * Register the default template system
 *
 * @returns {void}
 */
const registerDefault = () => {
  templateSystems.set('handlebars', handlebars.template())
}

/**
 * Register a template system
 *
 * @param {string} name
 * @param {object} system
 * @return {Map}
 */
const register = (name, system) => {
  return templateSystems.set(name, system.template())
}

module.exports = {
  getSystem,
  importSystems,
  register,
  registerDefault
}
