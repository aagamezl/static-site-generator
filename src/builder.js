const fs = require('fs-extra')
const path = require('path')

const hljs = require('highlight.js')
const markdown = require('markdown-it')
const matter = require('gray-matter')

const { THEMES_PATH } = require('./constants')
const {
  getExportPath,
  getGlobPattern,
  getPath,
  isContentFile,
  isAssetFile
} = require('./utils')
const {
  getFileContent,
  getData,
  writeFileContent,
  parseContent
} = require('./content')
const { getFiles } = require('./getFiles')
const { getSystem } = require('./template/templateSystem')

const commonmark = markdown('commonmark', {
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const value = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value

        return `<pre class="hljs"><code>${value}</code></pre>`
      } catch (__) { }
    }

    return `<pre class="hljs"><code>${commonmark.utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * Build a file, the file can be a content, assets or a template file. This
 * function is called by chokidar on change event.
 *
 * @param {string} file
 * @param {object} config
 */
const buildFile = async (file, config) => {
  if (isAssetFile(config.assets, file)) {
    const exportPath = getExportPath(file, config)
    const data = await getFileContent(file)

    writeFileContent(exportPath, data)

    return
  }

  const data = await getData(
    getPath(config.content.path),
    getGlobPattern(config.content.files)
  )

  // Generate the site structure, this is necessary to create the navigation
  const site = await generateSite(data, config)

  if (isContentFile(file)) {
    // Generate the file content
    const content = await generateFile(file)

    if (content.type === 'pages') {
      // Inject the page into the site pages array
      site.pages = [content]

      // Remove the posts from the site
      site.posts = []
    } else {
      // Remove the pages from the site
      site.pages = []

      // Inject the post into the site posts array
      site.posts = [content]
    }
  }

  // Write the file content
  await writeContent({ ...site, ...config.site }, config)
}

/**
 * Build the site; this function is called by the the command line option and by
 * chokidar initalization when the build directory is empty.
 *
 * @param {object} config
 * @return {boolean}
 */
const buildSite = async (config) => {
  const data = await getData(
    getPath(config.content.path),
    getGlobPattern(config.content.files)
  )

  const site = await generateSite(data, config)

  await writeContent({ ...site, ...config.site }, config)
  await copyAssets(config)

  return true
}

/**
 * compile the content of the site, creating the navigation, post and the pages
 *
 * @param {object} site
 * @param {object} item
 * @return {object}
 */
const compileContent = (site, item) => {
  if (!item.layout || item.type === 'pages') {
    const { title, permalink } = item

    if (!Array.isArray(site.navigation)) {
      site.navigation = []
    }

    site.navigation.push({ title, permalink })

    if (!Array.isArray(site.pages)) {
      site.pages = []
    }

    site.pages.push(item)
  } else {
    if (!Array.isArray(site.posts)) {
      site.posts = []
    }

    if (site.posts.length > 0) {
      const previousItem = site.posts[site.posts.length - 1]

      previousItem.next = {
        url: item.permalink
      }

      item.previous = {
        url: previousItem.permalink
      }
    }

    site.posts.push(item)
  }

  return site
}

/**
 * Compile the markdown in a file
 *
 * @param {object} { data, content, type, date }
 * @return {object}
 */
const compileMarkdown = ({ data, content, type, date }) => {
  data.date = data.date === undefined ? date : data.date

  return { ...data, type, content: content ? commonmark.render(content) : '' }
}

/**
 * Copy all the assets to the build directory
 *
 * @param {object} config
 */
const copyAssets = async (config) => {
  const assetsPath = getPath(THEMES_PATH, config.theme)
  const files = await getFiles(assetsPath, getGlobPattern(config.assets))

  for (const file of files) {
    const exportPath = getPath(config.build, file)

    await fs.copy(path.join(assetsPath, file), exportPath)
  }
}

/**
 * Generate the site structure, compile the markdown and compile the content
 *
 * @param {object} data
 * @param {object} config
 * @return {object}
 */
const generateSite = async (data, config) => {
  data = Array.isArray(data) ? data : [data]

  return data.map(parseFrontmatter)
    .map(compileMarkdown)
    .filter(page => page.layout !== undefined)
    .sort(sortContent)
    .reduce(compileContent, {})
}

/**
 * Generate a file content, this function is called by the buildFile function
 * when a file change is detected by chokidar.
 *
 * @param {string} file
 * @return {object}}
 */
const generateFile = async (file) => {
  const content = await parseContent(file)

  return compileMarkdown(parseFrontmatter(content))
}

/**
 * Parse the frontmatter of a file
 *
 * @param {object} content
 * @return {object}
 */
const parseFrontmatter = (content) => {
  return matter(content)
}

/**
 * Sort the content by date
 *
 * @param {object} a
 * @param {object} b
 * @return {object}
 */
const sortContent = (a, b) => {
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}

/**
 * Write the content of the site
 *
 * @param {object} site
 * @param {object} config
 */
const writeContent = async (site, config) => {
  const { navigation = [], pages = [], posts = [] } = site
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

/**
 * Write the content of a page without a layout
 *
 * @param {object} data
 * @param {object} config
 * @return {object}
 */
const writePage = async (data, config) => {
  const exportPath = getPath(config.build, data.permalink)

  return await fs.writeFile(exportPath, data.content, 'utf-8')
}

/**
 * Write the content of a page with a layout
 *
 * @param {object} data
 * @param {object} config
 * @return {object}
 */
const writePageWithLayout = async (data, config) => {
  const layoutName = `${data.layout}.html`
  const layoutPath = getPath(THEMES_PATH, config.theme, layoutName)
  const exportPath = getPath(config.build, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')
  const templateSystem = getSystem(config.templateSystem)

  return fs.writeFile(exportPath, templateSystem.compile(html, data), 'utf-8')
}

module.exports = {
  buildFile,
  buildSite
}
