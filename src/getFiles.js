const glob = require('glob')

/**
 * Get the files in a directory
 *
 * @param {string} directory
 * @param {string} pattern
 * @return {Promise<string[]>}
 */
const getFiles = async (directory, pattern) => {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: directory }, (error, files) => {
      if (error) {
        return reject(error)
      }

      return resolve(files)
    })
  })
}

module.exports = {
  getFiles
}
