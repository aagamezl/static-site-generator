const { readdir } = require('fs').promises

const glob = require('glob')

const getFiles = async (dir, pattern) => {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: dir }, (error, files) => {
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
