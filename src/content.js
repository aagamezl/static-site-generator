const fs = require('fs-extra')
const path = require('path')

const { getFiles } = require('./getFiles')

/**
 * Get the content of the content directory, parsing each file and
 * returning an array of objects.
 *
 * @param {string} contentPath
 * @param {string} pattern
 * @return {Array<object>}
 */
const getData = async (contentPath, pattern) => {
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

/**
 * Get the content of a file.
 *
 * @param {string} filename
 * @param {string} [encoding='utf8']
 * @return {Promise<string>}
 */
const getFileContent = (filename, encoding = 'utf8') => {
  try {
    return fs.readFile(filename, encoding)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Verify if the directory is empty or not.
 *
 * @param {string} directory
 * @return {boolean}
 */
const isDirectoryEmpty = async (directory) => {
  const result = await fs.readdir(directory)

  return !result.length
}

/**
 * Parse the content of a file, getting the type,filenae, content and date.
 *
 * @param {string} filename
 * @param {string} [encoding='utf8']
 * @return {object}
 */
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

/**
 * Write the a content to a file.
 *
 * @param {string} filename
 * @param {string} content
 * @param {string} [encoding='utf8']
 * @return {Promise<void>}
 */
const writeFileContent = (filename, content, encoding = 'utf8') => {
  return fs.writeFile(filename, content, encoding)
}

module.exports = {
  isDirectoryEmpty,
  getData,
  getFileContent,
  parseContent,
  writeFileContent
}
