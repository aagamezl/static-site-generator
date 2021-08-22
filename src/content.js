const fs = require('fs').promises
const path = require('path')

const { getFiles } = require('./getFiles')

const getContent = async (filename) => {
  const segments = filename.split(path.sep)
  const type = segments[segments.length - 2]
  const content = await fs.readFile(filename, 'utf8')
  const { mtime } = await fs.stat(filename)

  return {
    content,
    type,
    filename: path.basename(filename),
    date: mtime
  }
}

const getData = async (contentPath, pattern = '**/*.{md,html}') => {
  const files = await getFiles(contentPath, pattern)

  const result = []
  for (const file of files) {
    try {
      const filename = path.join(contentPath, file)

      result.push(await getContent(filename))
    } catch (error) {
      console.error(error)
    }
  }

  return result
}

module.exports = {
  getContent,
  getData
}
