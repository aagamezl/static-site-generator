const path = require('path')

const fs = require('fs-extra')
const { prompt } = require('@devnetic/cli')

const { THEMES_PATH } = require('./constants')
const { getConfig, getPath } = require('./utils')

const cleanSite = async (config) => {
  const questions = [{
    type: 'input',
    name: 'clean',
    message: 'Are you sure to clean the build diretory?: '
  }]

  const answers = await prompt(questions)

  if (answers.clean === 'yes' || answers.clean === 'y') {
    console.log(`Cleaning ${getPath(config.build)} directory`)

    try {
      await fs.emptyDir(getPath(config.build))
    } catch (error) {
      console.error(error)

      throw new Error(error)
    }
  }
}

const createSite = async () => {
  const templateConfigPath = path.resolve(__dirname, '../template/config.json')
  const exportConfigPath = getPath('config.json')

  const config = getConfig(templateConfigPath)

  const questions = [{
    type: 'input',
    name: 'content',
    message: "What's the content directory? "
  }, {
    type: 'input',
    name: 'build',
    message: "What's the build directory? "
  }, {
    type: 'input',
    name: 'theme',
    message: "What's the theme? "
  }, {
    type: 'input',
    name: 'paginate',
    message: "What's the paginate amount "
  }, {
    type: 'input',
    name: 'siteTitle',
    message: "What's the site title? "
  }, {
    type: 'input',
    name: 'author',
    message: "What's the author name? "
  }]

  const answers = await prompt(questions)

  config.data.path = answers.content || config.data.path
  config.build = answers.build || config.build
  config.theme = answers.theme || config.theme
  config.paginate = Number(answers.paginate || config.paginate)
  config.site.title = answers.siteTitle
  config.site.author = answers.author

  await fs.writeFile(exportConfigPath, JSON.stringify(config, null, 2), 'utf-8')

  await fs.ensureDir(config.data.path)
  await fs.ensureDir(path.join(config.data.path, 'pages'))
  await fs.ensureDir(path.join(config.data.path, 'posts'))
  await fs.ensureDir(config.build)
  await fs.ensureDir(getPath(THEMES_PATH, config.theme))
}

module.exports = {
  cleanSite,
  createSite
}
