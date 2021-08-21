#!/usr/bin/env node

const path = require('path')

const { getParams, usage } = require('@devnetic/cli')
const chokidar = require('chokidar')

const { build, createSite } = require('../src')
const { getConfig } = require('../src/utils')

const params = getParams()

if (params.help || params.h) {
  usage('Usage: $0 <command> [options]')
    .option(['-b', '--build'], '\tRun the build process')
    .option(['-n', '--new'], '\tGenerate a new site')
    .option(['-w', '--watch'], '\tRun the build process watching changes')
    .option(['-h', '--help'], '\tShow this help')
    .epilog(`Copyright ${new Date().getFullYear()} - Static Site Generator`)
    .show()

  process.exit(0)
}

if (params.n || params.new) {
  createSite().then(() => {
    process.exit(0)
  })
}

if (params.w || params.watch) {
  const config = getConfig()
  const dataPath = path.join(config.data.path, '/**/*')
  const options = {
    ignoreInitial: true
  }

  // Watch for changes in the data folder
  chokidar.watch(dataPath, options).on('all', build)

  console.info(`Watching for changes in the data folder - [${dataPath}]`)
} else if (params.b || params.build || Object.keys(params).length === 0) {
  build()
}
