const parse = (markdown) => {
  const frontmatterBlockRegex = /---([\s\S]+)---\n+?([\s\S]+)?/gm
  const frontmatterValuesRegex = /(?:(.+):(.+))/gm

  if (markdown.trim().length === 0) {
    return { config: undefined, content: '' }
  }

  const [ matches ] = Array.from(markdown.matchAll(frontmatterBlockRegex))
  const config =  Array.from(matches[1].matchAll(frontmatterValuesRegex)).reduce((config, match) => {
    config[[match[1].trim()]] = match[2].trim()

    return config
  }, {})

  return {
    config,
    content: matches[2] || ''
  }
}

// [\s\S]+?

// (?:(.+):\s*?(.+))

// (\-\-\-)\n?([\s\S]+\n+)*(\-\-\-)

// ---([\s\S]+)---

//  /(?:---\n)?(?:(.+):([^\n]+))(?:\n---)?/gm

module.exports = {
  parse
}
