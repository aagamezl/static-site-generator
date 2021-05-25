const path = require('path')

const { titleCase } = require('./../utils')

const LISTS = ['categpries', 'tags']

const parse = ({ content, filename, title, type, date }) => {
  const frontmatterBlockRegex = /---([\s\S]+)---\n+?([\s\S]+)?/gm
  const frontmatterValuesRegex = /(?:(.+):(.+))/gm
  const frontmatterList = /^-\s+(.+)$/gm

  const [matches] = Array.from(content.matchAll(frontmatterBlockRegex))

  // if the content don't have a frontmatter block
  if (!matches) {
    return {
      config: {
        permalink: filename,
        title: title || titleCase(path.parse(filename).name)
      },
      content: content
    }
  }

  const values = Array.from(matches[1].matchAll(frontmatterValuesRegex))

  const config = values.reduce(parseValue, {})

  return {
    config,
    content: matches[2] || '',
    type,
    date
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
