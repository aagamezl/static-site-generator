const fs = require('fs')
const path = require('path')

const { format } = require('@devnetic/cli')

class Config {
  static load (configPath, parse = true) {
    if (this.items === undefined) {
      try {
        configPath = configPath || path.resolve(process.cwd(), './config.json')
        const config = fs.readFileSync(configPath, 'utf8')

        this.items = parse === true ? JSON.parse(config) : config

        return this.items
      } catch (error) {
        const message = format.bold().red

        console.log(message('Config file not found, please create a site with `ssg -n`'))

        process.exit(1)
      }
    } else {
      return this.items
    }
  }
}

module.exports = {
  Config
}
