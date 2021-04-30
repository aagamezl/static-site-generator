const fs = require('fs').promises
const { join } = require('path')

const { getFiles } = require('./getFiles')

const getContent = async (path, pattern = '**/*.{md,html}') => {
  const files = await getFiles(path, pattern)

  const result = []
  for (let index = 0, length = files.length; index < length; index ++) {
    try {
      const filename = join(path, files[index])
      const content = await fs.readFile(filename, 'utf8')

      result.push({ content, filename })
    } catch (error) {
      console.error(error)
    }
  }

  return result
}

module.exports = {
  getContent
}
