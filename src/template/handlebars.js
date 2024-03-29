const handlebars = require('handlebars')
const utils = require('@devnetic/utils')

handlebars.registerHelper('formatDate', (value) => {
  return utils.dateFormat(new Date(value), 'YYYY-MM-dd HH:mm:ss')
})

handlebars.registerHelper('getCurrentYear', () => {
  return utils.dateFormat(new Date(new Date()), 'YYYY')
})

handlebars.registerHelper('twitterShare', (via, hashtags, size) => {
  return `<a class="twitter-share-button" href="https://twitter.com/intent/tweet?via=${via}&hashtags=${hashtags}" data-size="${size}">Tweet</a>`
})

/**
 * Compile the template and return the compiled result.
 *
 * @param {string} template
 * @param {object|Array} data
 * @return {string}
 */
const compile = (template, data) => {
  const templateFunc = handlebars.compile(template)

  return templateFunc(data)
}

/**
 * Export the handlebars template system.
 *
 * @return {object}
 */
const template = () => {
  return {
    name: 'handlebars',
    system: handlebars,
    compile
  }
}

module.exports = {
  template
}
