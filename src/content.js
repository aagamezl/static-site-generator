const fs = require('fs').promises
const { basename, dirname, join } = require('path')

const { getFiles } = require('./getFiles')

const getContent = async (path, pattern = '**/*.{md,html}') => {
  const files = await getFiles(path, pattern)

  const result = []
  for (let index = 0, length = files.length; index < length; index ++) {
    try {
      const filename = join(path, files[index])
      const type = dirname(files[index])
      const content = await fs.readFile(filename, 'utf8')
      const { mtime } = await fs.stat(filename)

      result.push({
        content,
        type,
        filename: basename(filename),
        date: mtime
      })
    } catch (error) {
      console.error(error)
    }
  }

  return result
}

module.exports = {
  getContent
}
