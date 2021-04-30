const { basename } = require('path')

const LISTS = ['categpries', 'tags']

const parse = (page) => {
  const frontmatterBlockRegex = /---([\s\S]+)---\n+?([\s\S]+)?/gm
  const frontmatterValuesRegex = /(?:(.+):(.+))/gm
  const frontmatterList = /^-\s+(.+)$/gm

  const [matches] = Array.from(page.content.matchAll(frontmatterBlockRegex))

  if (page.content.trim().length === 0) {
    return { config: undefined, content: '' }
  }

  if (!matches) {
    return {
      config: {
        permalink: basename(page.filename)
      },
      content: page.content
    }
  }

  const values = Array.from(matches[1].matchAll(frontmatterValuesRegex))
  // const lists = Array.from(matches[1].matchAll(frontmatterList))

  const config = values.reduce(parseValue, {})
  // const config =  Array.from(matches[1].matchAll(frontmatterValuesRegex)).reduce((config, match) => {
  //   const name = match[1].trim()
  //   const value = match[2].trim()

  //   config[name] = getValue(name, value)

  //   return config
  // }, {})

  return {
    config,
    content: matches[2]
  }
}

const parseValue = (config, match) => {
  const name = match[1].trim()
  const value = match[2].trim()

  // config[name] = getValue(name, value)
  config[name] = value

  return config
}

const getValue = (name, value) => {
  const frontmatterList = /^-\s+(.+)$/gm

  return LISTS.includes(name) ? Array.from(value.matchAll(frontmatterList)) : value
}

// [\s\S]+?

// (?:(.+):\s*?(.+))

// (\-\-\-)\n?([\s\S]+\n+)*(\-\-\-)

// ---([\s\S]+)---

//  /(?:---\n)?(?:(.+):([^\n]+))(?:\n---)?/gm

module.exports = {
  parse
}
