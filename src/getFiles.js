const { readdir } = require('fs').promises
const { resolve } = require('path')

const getFiles = async (dir, extension) => {
  const dirents = await readdir(dir, { withFileTypes: true })

  const files = await Promise.all(dirents.map((dirent) => {
    const resourcePath = resolve(dir, dirent.name)

    if (dirent.isDirectory()) {
      return getFiles(resourcePath, extension)
    }

    if (dirent.name.endsWith(extension)) {
      return resourcePath
    }
  }))

  return Array.prototype.concat(...files.filter(file => file !== undefined)) // flat the array
}

module.exports = {
  getFiles
}
