const { forParser, ifParser } = require('./parsers')

const placeholderRegex = /({.+?})/gm

/**
 * Generate a function representing the template literal for the complete
 * cpmpiled template code
 *
 * @param {string} templateLiteral Template code
 * @param {string} [params = 'data'] Param name for the generated template
 * function
 * @returns {Function}
 */
const assemble = (templateLiteral, params = 'data') => {
  return new Function(params, 'return `' + templateLiteral + '`;')
}

const execute = (templateCompiled, data) => {
  return assemble(templateCompiled, `{ ${Object.keys(data).join(', ')} }`)(data)
}

/**
 * Compile a template, expanding all the engine expressions
 *
 * @param {string} html
 * @returns {string}
 */
const compile = (template) => {
  let html = forParser.compile(fixPlaceholders(template))
  html = ifParser.compile(html)

  return html
}

/**
 * Fix the expression placeholders, adding the $ character to complete the
 * template literal
 *
 * @param {string} html
 * @returns {string}
 */
const fixPlaceholders = (html) => {
  return html.replace(placeholderRegex, '$$$1')
}

module.exports = {
  assemble,
  compile,
  execute
}
