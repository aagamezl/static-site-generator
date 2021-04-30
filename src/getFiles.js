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

  // const dirents = await readdir(dir, { withFileTypes: true })

  // const files = await Promise.all(dirents.map((dirent) => {
  //   const resourcePath = resolve(dir, dirent.name)

  //   if (dirent.isDirectory()) {
  //     return getFiles(resourcePath, extension)
  //   }

  //   if (dirent.name.endsWith(extension)) {
  //     return resourcePath
  //   }
  // }))

  // return Array.prototype.concat(...files.filter(file => file !== undefined)) // flat the array
}

module.exports = {
  getFiles
}
