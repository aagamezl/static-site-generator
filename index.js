const path = require('path')
const chokidar = require('chokidar')

const config = require('./config')
const { build } = require('./src')

if (config === undefined) {
  throw new Error('Config file not found')
}

const params = process.argv.slice(2)

if (params.length > 0 && params[0] === '--watch') {
  const dataPath = path.join(config.data.path, '/**/*')
  const options = {
    ignoreInitial: true
  }

  // Watch for changes in the data folder
  chokidar.watch(dataPath, options).on('all', build)

  console.info(`Watching for changes in the data folder - [${dataPath}]`)
} else {
  build()
}
