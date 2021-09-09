const handlebars = require('handlebars')
const utils = require('@devnetic/utils')

handlebars.registerHelper('formatDate', function (value) {
  return utils.dateFormat(new Date(value), 'YYYY-MM-dd HH:mm:ss')
})

const compile = (template, data) => {
  const templateFunc = handlebars.compile(template)

  return templateFunc(data)
}

const register = () => {
  return {
    name: 'handlebars',
    compile
  }
}

module.exports = {
  compile,
  register
}
