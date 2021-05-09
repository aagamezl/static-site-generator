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

// const data = {
//   people: [{
//     id: 1,
//     firstName: 'Jack',
//     lastName: 'Vasquez',
//     email: 'jvasquez0@unblog.fr',
//     gender: 'Male',
//     ipAddress: '210.150.175.206'
//   }, {
//     id: 2,
//     firstName: 'John',
//     lastName: 'Vasquez',
//     email: 'jvasquez0@unblog.fr',
//     gender: 'Male',
//     ipAddress: '210.150.175.206'
//   }]
// }


// const html = `
// <tr data-for="person in people">
//   <td>{person.id}</td>
//   <td>{person.firstName}</td>
//   <td>{person.lastName}</td>
//   <td>{person.email}</td>
//   <td>{person.gender}</td>
//   <td>{person.ipAddress}</td>
// </tr>`

// const templateCompiled = template.compile(html)
// const templateAssembled = template.assemble(templateCompiled)
// console.log(templateAssembled(data));

const DATA_PATH = 'content'
const BUILD_PATH = 'public'
const THEME_PATH = 'themes'
const THEME_NAME = 'tale'
const DATA_EXTENSION = '.md'

const getPath = (...paths) => {
  return path.join(process.cwd(), ...paths)
}

// const writeIndexPage = async (data) => {
// const writePage = async (data, layout) => {
const writePage = async (data) => {
  const layoutPage = `${data.layout}.html`
  const layoutPath = getPath(THEME_PATH, THEME_NAME, layoutPage)
  const exportPath = getPath(BUILD_PATH, data.permalink)

  const html = await fs.readFile(layoutPath, 'utf-8')
  const templateCompiled = template.compile(html)
  // const templateAssembled = template.assemble(templateCompiled, data.layout)

  // await fs.writeFile(exportPath, templateAssembled(data), 'utf-8')

   await fs.writeFile(exportPath, template.execute(templateCompiled, data), 'utf-8')
}

// const writePosts = async (posts) => {
//   const themePath = getPath(THEME_PATH, THEME_NAME, 'post.html')

//   for (post of posts) {
//     const postPath = getPath(BUILD_PATH, post.path)

//     const html = await fs.readFile(themePath, 'utf-8')
//     const templateCompiled = template.compile(html)
//     const templateAssembled = template.assemble(templateCompiled)

//     await fs.writeFile(postPath, templateAssembled({ post }))
//   }
// }

const getVariableName = target => Object.keys(target)[0]

const compileMarkdown = ({ config, content }) => {
  return { ...config, content: md.render(content) }
}

const writeIndexPage = async (data) => {
  console.log(data);
}

const getNavigation = (contents) => {
  return contents.filter(content => content.layout === 'page')
    .map(({ title, permalink }) => ({ title, permalink }))
}

const writeContent = (contents, navigation) => {
  contents.forEach(content => {
    writePage({ ...content, navigation })
  })
}

const main = async () => {
  try {
    const data = await getContent(path.join(process.cwd(), DATA_PATH), DATA_EXTENSION)

    const content = await data.map(content => frontmatter.parse(content))
      // .map(({ config, c5ontent }) => ({ ...config, content: md.render(content) }))
      .map(compileMarkdown)
      // .filter(page => page.content.trim().length !== 0)
      .filter(page => page.layout !== undefined)
      // .map(writePage)

    const navigation = getNavigation(content)

    writeContent(content, navigation)
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
