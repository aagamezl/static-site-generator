const fs = require('fs-extra')
const path = require('path')

const { getFiles } = require('./getFiles')

const getData = async (contentPath, pattern = '**/*.{md,html}') => {
  const files = await getFiles(contentPath, pattern)

  const result = []
  for (const file of files) {
    try {
      const filename = path.join(contentPath, file)

      result.push(await parseContent(filename))
    } catch (error) {
      console.error(error)
    }
  }

  return result
}

const getFileContent = (file, encoding = 'utf8') => {
  try {
    return fs.readFile(file, encoding)
  } catch (error) {
    console.error(error)
  }
}

const parseContent = async (filename, encoding = 'utf8') => {
  const segments = filename.split(path.sep)
  const type = segments[segments.length - 2]
  const content = await getFileContent(filename)
  const { mtime } = await fs.stat(filename)

  return {
    content,
    type,
    filename: path.basename(filename),
    date: mtime
  }
}

const writeFileContent = (file, content, encoding = 'utf8') => {
  return fs.writeFile(file, content, encoding)
}

module.exports = {
  getData,
  getFileContent,
  parseContent,
  writeFileContent
}
