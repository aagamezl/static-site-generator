const fs = require('fs-extra')
const path = require('path')

const handlebars = require('handlebars')
const hljs = require('highlight.js')
const matter = require('gray-matter')
const utils = require('@devnetic/utils')

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

const { getConfig, getPath, getExportPath } = require('./utils')
const {
  getData,
  getFileContent,
  parseContent,
  writeFileContent
} = require('./content')
const { ASSETS_EXTENSIONS, BUILD_EXTENSIONS, THEMES_PATH } = require('./constants')

handlebars.registerHelper('formatDate', function (value) {
  return utils.dateFormat(new Date(value), 'YYYY-MM-dd HH:mm:ss')
})

const build = async (file, stats) => {
  try {
    const config = getConfig()
    let data

    if (file !== undefined) {
      // Check if the file is asset file.
      if (ASSETS_EXTENSIONS.includes(path.extname(file))) {
        const exportPath = getExportPath(file, config)
        const data = await getFileContent(file)

        writeFileContent(exportPath, data)

        return
      }

      // Check if the file is not a content file.
      if (!BUILD_EXTENSIONS.includes(path.extname(file))) {
        const data = await getFileContent(file)

        writeFileContent(getPath(config.build, path.basename(file)), data.content)

        return
      }

      data = [await parseContent(file)]
    } else {
      data = await getData(getPath(config.data.path), config.data.pattern)
    }

    const site = await data.map(parseFrontmatter)
      .map(compileMarkdown)
      .filter(page => page.layout !== undefined)
      .sort(sortContent)
      .reduce(buildContent, {})

    await writeContent({ ...site, ...config.site }, config)
    await copyAssets(config.assets, config)

    return true
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
  for (const asset of assets) {
    try {
      const assetsPath = getPath(THEMES_PATH, config.theme, asset)
      const exportPath = getPath(config.build, asset)

      await fs.copy(assetsPath, exportPath)
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.info(`No asset [${asset}] exists.`)
      } else {
        console.error(error.message)
      }
    }
  }
}

const compileMarkdown = ({ data, content, type, date }) => {
  data.date = data.date === undefined ? date : data.date

  return { ...data, type, content: content ? md.render(content) : '' }
}

const parseFrontmatter = (content) => {
  return matter(content)
}

const sortContent = (a, b) => {
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}

const writeContent = async (site, config) => {
  const { navigation = [], pages = [], posts } = site
  const content = [...pages, ...posts]

  for (const page of content) {
    if (!page.permalink) {
      return
    }

    if (page.layout) {
      await writePageWithLayout({ ...page, navigation, site }, config)
    } else {
      await writePage({ ...page, navigation, site }, config)
    }
  }
}

const writePage = async (data, config) => {
  const exportPath = getPath(config.build, data.permalink)

  return await fs.writeFile(exportPath, data.content, 'utf-8')
}

const writePageWithLayout = async (data, config) => {
  const layoutName = `${data.layout}.html`
  const layoutPath = getPath(THEMES_PATH, config.theme, layoutName)
  const exportPath = getPath(config.build, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')

  return fs.writeFile(exportPath, handlebars.compile(html)(data), 'utf-8')
}

module.exports = {
  build,
  buildContent,
  compileMarkdown,
  getPath,
  parseFrontmatter,
  sortContent,
  writeContent,
  writePage,
  writePageWithLayout
}
