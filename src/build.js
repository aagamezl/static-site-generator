const fs = require('fs').promises
const path = require('path')

const handlebars = require('handlebars')
const hljs = require('highlight.js')
const md = require('markdown-it')('commonmark', {
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) { }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

const { getContent } = require('./content')
const { frontmatter } = require('./parsers')

const config = require('./../config.json')

const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
}

const writePageWithLayout = async (data) => {
  const layoutName = `${data.layout}.html`
  const layoutPath = getPath(config.layout, config.theme, layoutName)
  const exportPath = getPath(config.build, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')

  return await fs.writeFile(exportPath, handlebars.compile(html)(data), 'utf-8')
}

const writePage = async (data) => {
  const exportPath = getPath(config.build, data.permalink)

  return await fs.writeFile(exportPath, data.content, 'utf-8')
}

const compileMarkdown = ({ config, content, type, date }) => {
  return { ...config, type, content: content ? md.render(content) : '', date }
}

const parseFrontmatter = (content) => {
  return frontmatter.parse(content)
}

const writeContent = (site) => {
  const { navigation, pages, posts } = site
  const content = [...pages, ...posts]

  content.forEach(page => {
    if (!page.permalink) {
      return
    }

    if (page.layout) {
      return writePageWithLayout({ ...page, navigation, site })
    }

    return writePage({ ...page, navigation, site })
  })
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

const sortContent = (a, b) => {
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}

const main = async () => {
  try {
    const data = await getContent(getPath(config.data.path), config.data.pattern)

    const site = await data.map(parseFrontmatter)
      .map(compileMarkdown)
      .filter(page => page.layout !== undefined)
      .sort(sortContent)
      .reduce(buildContent, {})

    writeContent({ ...site, ...config.site })
  } catch (error) {
    console.error(error);
  }
}

main()
