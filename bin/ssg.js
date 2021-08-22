#!/usr/bin/env node

const { getParams, usage } = require('@devnetic/cli')
const chokidar = require('chokidar')

const { version } = require('./../package.json')

const {
  build,
  constants,
  createSite,
  getPath,
  server
} = require('../src')
const { getConfig } = require('../src/utils')

const params = getParams()

if (params.help || params.h) {
  usage('Usage: $0 <command> [options]')
    .option(['-b', '--build'], '\t\tRun the build process')
    .option(['-n', '--new'], '\t\tGenerate a new site')
    .option(['-w', '--watch'], '\t\tRun the build process watching changes')
    .option(['-v', '--version'], '\tDisplay version')
    .option(['-h', '--help'], '\t\tShow this help')
    .epilog(`Copyright ${new Date().getFullYear()} - Static Site Generator`)
    .show()

  process.exit(0)
}

if (params.v || params.version) {
  console.log(`v${version}`)
  process.exit(0)
}

if (params.n || params.new) {
  createSite().then(() => {
    process.exit(0)
  })
}

if (params.w || params.watch) {
  const config = getConfig()

  const themePath = getPath(constants.THEMES_PATH, config.theme, '/**/*')
  const dataPath = getPath(config.data.path, '/**/*')
  const options = {
    ignoreInitial: true
  }

  // Watch for changes in the data folder
  chokidar.watch([dataPath, themePath], options).on('change', (path, stats) => {
    build(path)

    console.log(`${path} has been changed`)
  })

  const params = {
    port: constants.SERVER_PORT, // Set the server port. Defaults to 8080.
    host: constants.SERVER_HOST, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: getPath(config.public), // Set root directory that's being served. Defaults to cwd.
    watch: getPath(config.public),
    wait: constants.SERVER_WAIT_TIME // Wait for all changes, before reloading.
  }

  server(params)

  console.info(`Watching for changes in the data folder - [${dataPath}]`)
} else if (params.b || params.build || Object.keys(params).length === 0) {
  build()
}
