const fs = require('fs').promises
const path = require('path')

const hljs = require('highlight.js')
const md = require('markdown-it')('commonmark', {
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) { }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

const template = require('./template')
const { getContent } = require('./content')
const { frontmatter } = require('./parsers')

const config = require('./../config.json')

const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
}

const writePage = async (data) => {
  const pageName = `${data.layout}.html`
  const layoutPath = getPath(config.layout, config.theme, pageName)
  const exportPath = getPath(config.build, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')
  const templateCompiled = template.compile(html)

  await fs.writeFile(exportPath, template.execute(templateCompiled, data), 'utf-8')
}

const getVariableName = target => Object.keys(target)[0]

const compileMarkdown = ({ config, content }) => {
  return { ...config, content: content ? md.render(content) : '' }
}

const parseFrontmatter = (content) => {
  return frontmatter.parse(content)
}

const writeIndexPage = async (data) => {
  console.log(data);
}

const writeContent = (content) => {
  const { navigation, site } = content;

  content.pages.forEach(page => {
    writePage({ ...page, navigation, site })
  })
}

const buildContent = (result, page) => {
  if (page.layout === 'page') {
    const { title, permalink } = page
    result.navigation.push({ title, permalink })
  }

  result.pages.push(page)

  return result
}

const main = async () => {
  try {
    const site = {
      site: {
        title: config.title
      },
      pages: [],
      navigation: []
    }
    const data = await getContent(getPath(config.data.path), config.data.extension)

    const content = await data.map(parseFrontmatter)
      .map(compileMarkdown)
      // .filter(page => page.content.trim().length !== 0)
      // .filter(page => page.layout)
      .reduce(buildContent, site)

    // const navigation = getNavigation(contents)
    // navigation.unshift({ title: 'Posts', permalink: 'index.html' })

    writeContent(content)
    // writeIndexPage(contents, navigation })
    // writePosts(posts)

    // for (const post of posts) {
    //   writePage(post)
    // }

    // console.log(posts);
  } catch (error) {
    console.error(error);
  }

  // const html = `
  // <ul class="nav-menu">
  //   <li><a href="./{page.title.toLowerCase()}.html" data-for="page of pages">{page.title}</a></li>
  // </ul>`

  // const templateCompiled = template.compile(html)
  // const templateAssembled = template.assemble(templateCompiled)
  // console.log(templateAssembled(data));
}

main()
