const fs = require('fs').promises
const path = require('path')

const { getFiles } = require('./getFiles')

// const getFiles = async (contentPath, fileType = '.json') => {
//   const files = await fs.readdir(contentPath, { withFileTypes: true })

//   return files
//     .filter(file => file.isFile() && file.name.endsWith(fileType))
//     .map(file => file.name)
// }

const getContent = async (contentPath, extension = '.json') => {
  // const contentPath = path.join(process.cwd(), DATA_PATH)

  const files = await getFiles(contentPath, extension)

  const result = []
  for (let index = 0, length = files.length; index < length; index ++) {
    try {
      const content = await fs.readFile(files[index], 'utf8')

      result.push(content)
    } catch (error) {
      console.error(error)
    }
  }

  return result

  // const result = []
  // for (let index = 0, length = files.length; index < length; index ++) {
  //   try {
  //     const data = await fs.readFile(path.join(contentPath, files[index]), 'utf8')
  //     const content = JSON.parse(data);

  //     result[content.type] = (result[content.type] || [])
  //     result[content.type].push(content)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // return result
}

module.exports = {
  getContent
}
