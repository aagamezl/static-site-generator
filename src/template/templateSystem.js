const handlebars = require('./handlebars')

const templateSystems = new Map()

const registerDefault = () => {
  templateSystems.set('handlebars', handlebars.register())
}

const register = (systemName, templateSystem) => {
  templateSystems.set(systemName, templateSystem.register())
}

const getTemplateSystem = (systemName) => {
  return templateSystems.get(systemName)
}

module.exports = {
  getTemplateSystem,
  register,
  registerDefault
}
