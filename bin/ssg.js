#!/usr/bin/env node

const chokidar = require('chokidar')
const { getParams, usage } = require('@devnetic/cli')

const { version } = require('./../package.json')

const {
  build,
  constants,
  createSite,
  getPath,
  server
} = require('../src')
const { getConfig } = require('../src/utils')
const { cleanSite } = require('../src/site')

const run = async () => {
  const params = getParams()
  const config = getConfig()

  if (params.help || params.h) {
    usage('Usage: $0 <command> [options]')
      .option(['-b', '--build'], '\t\tRun the build process')
      .option(['-c', '--clean'], '\t\tClean the build directory')
      .option(['-n', '--new'], '\t\tGenerate a new site')
      .option(['-v', '--version'], '\tDisplay version')
      .option(['-w', '--watch'], '\t\tRun the build process watching changes')
      .option(['-h', '--help'], '\t\tShow this help')
      .epilog(`Copyright ${new Date().getFullYear()} - Static Site Generator`)
      .show()

    process.exit(0)
  }

  if (params.b || params.build || Object.keys(params).length === 0) {
    await build()

    process.exit(0)
  }

  if (params.c || params.clean) {
    await cleanSite(config)

    process.exit(0)
  }

  if (params.n || params.new) {
    await createSite()

    process.exit(0)
  }

  if (params.v || params.version) {
    console.log(`v${version}`)
    process.exit(0)
  }

  if (params.w || params.watch) {
    const themePath = getPath(constants.THEMES_PATH, config.theme, '/**/*')
    const dataPath = getPath(config.data.path, '/**/*')
    const options = {
      ignoreInitial: true
    }

    // Watch for changes in the data folder
    chokidar.watch([dataPath, themePath], options).on('change', (path, stats) => {
      build(path)

      console.log(`Change detected ${path}`)
    })

    const params = {
      port: constants.SERVER_PORT, // Set the server port. Defaults to 8080.
      host: constants.SERVER_HOST, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
      root: getPath(config.build), // Set root directory that's being served. Defaults to cwd.
      watch: getPath(config.build),
      wait: constants.SERVER_WAIT_TIME // Wait for all changes, before reloading.
    }

    server(params)

    console.info(`Watching for changes in the data folder - [${dataPath}]`)
  }
}

run()
