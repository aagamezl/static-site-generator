const statementRegex = /\s+data-for=\"(.+)\s+of\s+(.+)\"/gm
const expressionRegex = /<(\w+).+(data-for=\"(.+)\s+of\s+(.+))\"\s*>([\s\S]*?)<\/\1>/gm
const SIGNATURE = 'data-for'

const compile = (html, data) => {
  if (!html.includes(SIGNATURE)) {
    return html
  }

  const statements = parse(html)

  statements.forEach(({ collection, iterator, template }) => {
    // const compiled = `\${data.${collection}.map((${iterator}, index) => \`${template}\`).join('\\n')}`
    const compiled = `\${${collection}.map((${iterator}, index) => \`${template}\`).join('\\n')}`
      .replace(statementRegex, '')

    html = html.replace(template, compiled)
  })

  // statements.forEach(forStatement => {
  //   const compiled = '${data.' + forStatement.collection +
  //     '.map((' + forStatement.iterator + ', index) => ' +
  //     '`' + forStatement.template + '`).join(\'\')}'

  //   html = html.replace(forStatement.template, compiled)
  //   html = html.replace(statementRegex, '')
  // })

  return html
}

const parse = (html) => {
  const matches = Array.from(html.matchAll(expressionRegex))

  return matches.map(match => {
    return {
      template: match[0],
      expression: match[2],
      iterator: match[3],
      collection: match[4],
    }
  })
}

module.exports = {
  compile,
  SIGNATURE
}
