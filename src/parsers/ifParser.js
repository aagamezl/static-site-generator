const statementRegex = /\s+data-if=\"\s*.+?\s*\"/gm
const expressionRegex = /<(\w+)\s+(data-if=\"\s*(.+?)\s*\")>[\s\S]*?<\/\1>/gm
const SIGNATURE = 'data-if'

const compile = (html) => {
  const statements = parse(html)

  statements.forEach(({ conditional, template }) => {
    // const compiled = '${' + conditional + ' ? `' +
    //   template + `\` : ''}`

    const compiled = `\${${conditional} ? \`${template}\` : ''}`

    html = html.replace(template, compiled)
    html = html.replace(statementRegex, '')
  })

  return html
}

const parse = (html) => {
  const matches = Array.from(html.matchAll(expressionRegex))

  return matches.map(match => {
    return {
      template: match[0],
      expression: match[2],
      conditional: match[3],
    }
  })
}

module.exports = {
  compile,
  SIGNATURE
}
