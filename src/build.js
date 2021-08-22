const fs = require('fs-extra')
const path = require('path')

const handlebars = require('handlebars')
const hljs = require('highlight.js')
const matter = require('gray-matter')
const utils = require('@devnetic/utils')
const { prompt } = require('@devnetic/cli')

const md = require('markdown-it')('commonmark', {
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) { }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

const { getConfig } = require('./utils')
const { getContent, getData } = require('./content')
const { THEMES_PATH } = require('./constants')

handlebars.registerHelper('formatDate', function (value) {
  return utils.dateFormat(new Date(value), 'YYYY-MM-dd HH:mm:ss')
})

const build = async (file, stats) => {
  try {
    const config = getConfig()
    const data = file === undefined
      ? await getData(getPath(config.data.path), config.data.pattern)
      : [await getContent(file)]

    const site = await data.map(parseFrontmatter)
      .map(compileMarkdown)
      .filter(page => page.layout !== undefined)
      .sort(sortContent)
      .reduce(buildContent, {})

    writeContent({ ...site, ...config.site }, config)
    copyAssets(config.assets, config)
  } catch (error) {
    console.error(error)
  }
}

const buildContent = (result, item) => {
  if (!item.layout || item.type === 'pages') {
    const { title, permalink } = item

    if (!Array.isArray(result.navigation)) {
      result.navigation = []
    }

    result.navigation.push({ title, permalink })

    if (!Array.isArray(result.pages)) {
      result.pages = []
    }

    result.pages.push(item)
  } else {
    if (!Array.isArray(result.posts)) {
      result.posts = []
    }

    if (result.posts.length > 0) {
      const previousItem = result.posts[result.posts.length - 1]

      previousItem.next = {
        url: item.permalink
      }

      item.previous = {
        url: previousItem.permalink
      }
    }

    result.posts.push(item)
  }

  return result
}

const copyAssets = async (assets, config) => {
  assets.forEach(async (asset) => {
    try {
      const assetsPath = getPath(THEMES_PATH, config.theme, asset)
      const exportPath = getPath(config.public, asset)

      await fs.copy(assetsPath, exportPath)
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.info(`No asset [${asset}] exists.`)
      } else {
        console.error(error.message)
      }
    }
  })
}

const compileMarkdown = ({ data, content, type, date }) => {
  data.date = data.date === undefined ? date : data.date

  return { ...data, type, content: content ? md.render(content) : '' }
}

const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
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
    name: 'public',
    message: "What's the public directory? "
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
  config.public = answers.public || config.public
  config.theme = answers.theme || config.theme
  config.paginate = Number(answers.paginate || config.paginate)
  config.site.title = answers.siteTitle
  config.site.author = answers.author

  await fs.writeFile(exportConfigPath, JSON.stringify(config, null, 2), 'utf-8')

  await fs.ensureDir(config.data.path)
  await fs.ensureDir(path.join(config.data.path, 'pages'))
  await fs.ensureDir(path.join(config.data.path, 'posts'))
  await fs.ensureDir(config.public)
  await fs.ensureDir(getPath(THEMES_PATH, config.theme))
}

const parseFrontmatter = (content) => {
  return matter(content)
}

const sortContent = (a, b) => {
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}

const writeContent = (site, config) => {
  const { navigation = [], pages = [], posts } = site
  const content = [...pages, ...posts]

  content.forEach(page => {
    if (!page.permalink) {
      return
    }

    if (page.layout) {
      return writePageWithLayout({ ...page, navigation, site }, config)
    }

    return writePage({ ...page, navigation, site }, config)
  })
}

const writePage = async (data, config) => {
  const exportPath = getPath(config.public, data.permalink)

  return await fs.writeFile(exportPath, data.content, 'utf-8')
}

const writePageWithLayout = async (data, config) => {
  const layoutName = `${data.layout}.html`
  const layoutPath = getPath(THEMES_PATH, config.theme, layoutName)
  const exportPath = getPath(config.public, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')

  return await fs.writeFile(exportPath, handlebars.compile(html)(data), 'utf-8')
}

module.exports = {
  build,
  buildContent,
  compileMarkdown,
  createSite,
  getPath,
  parseFrontmatter,
  sortContent,
  writeContent,
  writePage,
  writePageWithLayout
}
