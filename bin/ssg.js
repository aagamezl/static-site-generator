#!/usr/bin/env node

const { getParams, usage } = require('@devnetic/cli')
const chokidar = require('chokidar')

const { version } = require('./../package.json')

const { build, buildFile, constants, server } = require('../src')
const { cleanSite, createSite } = require('./../src/site')
const { getConfig, getPath } = require('./../src/utils')
const { isDirectoryEmpty } = require('./../src/content')

const params = getParams()
const config = getConfig()

if (params.help || params.h) {
  usage('Usage: ssg <option> [modifier]')
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

params.w = true
if (params.b || params.build/*  || Object.keys(params).length === 0 */) {
  build().then((result) => {
    process.exit(0)
  }).catch((error) => {
    console.error(error)

    process.exit(1)
  })
}

if (params.c || params.clean) {
  cleanSite(config, params.y).then((result) => {
    process.exit(0)
  }).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

if (params.n || params.new) {
  createSite().then(() => {
    process.exit(0)
  }).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

if (params.v || params.version) {
  console.log(`v${version}`)
  process.exit(0)
}

if (params.w || params.watch) {
  const themePath = getPath(constants.THEMES_PATH, config.theme, '/**/*')
  const dataPath = getPath(config.content.path, '/**/*')
  const options = {
    ignoreInitial: true
  }

  console.info(`Watching for changes in the data folder - [${dataPath}]`)

  // Watch for changes in the data folder
  chokidar.watch([dataPath, themePath], options)
    .on('ready', async (...params) => {
      console.log('Initial scan complete. Ready for changes')

      const isEmpty = await isDirectoryEmpty(getPath(config.build))

      const options = {
        port: constants.SERVER_PORT, // Set the server port. Defaults to 8080.
        host: constants.SERVER_HOST, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: getPath(config.build), // Set root directory that's being served. Defaults to cwd.
        watch: getPath(config.build),
        wait: constants.SERVER_WAIT_TIME // Wait for all changes, before reloading.
      }

      if (isEmpty === true) {
        console.log('Build directory is empty, building...')

        build().then((result) => {
          server(options)
        }).catch((error) => {
          console.error(error)

          process.exit(1)
        })
      } else {
        server(options)
      }
    })
    .on('change', (path, stats) => {
      console.log(`${path} has been changed`)
      buildFile(path, stats).then((result) => {
        console.log('Build complete')
      }).catch((error) => {
        console.error(error)

        process.exit(1)
      })
    })
}
