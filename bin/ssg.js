#!/usr/bin/env node

const chokidar = require('chokidar')
const { format, getParams, usage } = require('@devnetic/cli')

const templateSystem = require('./../src')
const {
  THEMES_PATH,
  SERVER_WAIT_TIME,
  SERVER_PORT,
  SERVER_HOST,
  TEMPLATE_SYSTEMS_PATH
} = require('./../src')
const { buildFile, buildSite } = require('./../src')
const { cleanSite, createScaffold } = require('./../src')
const { getPath, getConfig } = require('./../src')
const { isDirectoryEmpty } = require('./../src')
const { startServer } = require('./../src')
const { version } = require('./../package.json')

const params = getParams()
const infoLog = format.bold().blue
const errorLog = format.bold().red

try {
  (async () => {
    // Register default all the template engines availables
    templateSystem.registerDefault()

    // Import all the custom template systems
    const customTemplateSytems = await templateSystem.importSystems(
      '**/*.js',
      getPath(TEMPLATE_SYSTEMS_PATH)
    )

    // Register all the custom template systems
    customTemplateSytems.forEach(system => {
      const template = system.template()

      templateSystem.register(template.name, system)
    })

    if (params.n || params.new) {
      await createScaffold()

      process.exit(0)
    }

    const config = getConfig()

    if (params.b || params.build) {
      await buildSite(config)

      console.log(infoLog('Build complete'))

      process.exit(0)
    }

    if (params.c || params.clean) {
      await cleanSite(config, params.y || params.yes)

      process.exit(0)
    }

    if (params.help || params.h || Object.keys(params).length === 0) {
      usage('Usage: ssg <option> [modifier]')
        .option(['-b', '--build'], '\t\t\tRun the build process')
        .option(['-c', '--clean [-y, --yes]'], '\tClean the build directory')
        .option(['-n', '--new'], '\t\t\tGenerate a new site')
        .option(['-v', '--version'], '\t\tDisplay version')
        .option(['-w', '--watch'], '\t\t\tRun the build process watching changes')
        .option(['-h', '--help'], '\t\t\tShow this help')
        .epilog(`Copyright ${new Date().getFullYear()} - Static Site Generator`)
        .show()

      process.exit(0)
    }

    if (params.n || params.new) {
      await createScaffold()

      process.exit(0)
    }

    if (params.v || params.version) {
      console.log(infoLog(`v${version}`))

      process.exit(0)
    }

    if (params.w || params.watch) {
      const themePath = getPath(THEMES_PATH, config.theme, '/**/*')
      const dataPath = getPath(config.content.path, '/**/*')
      const options = {
        ignoreInitial: true
      }

      console.log(infoLog(`Watching for changes in the data folder - [${dataPath}]`))

      // Watch for changes in the data folder
      chokidar.watch([dataPath, themePath], options)
        .on('ready', async (...params) => {
          console.log(infoLog('Initial scan complete. Ready for changes'))

          const isEmpty = await isDirectoryEmpty(getPath(config.build))

          if (isEmpty === true) {
            console.log(infoLog('Build directory is empty, building...'))

            await buildSite(config)
          }

          const options = {
            port: config?.server?.port || SERVER_PORT, // Set the server port. Defaults to 8080.
            host: config?.server?.host || SERVER_HOST, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
            root: getPath(config.build), // Set root directory that's being served. Defaults to cwd.
            watch: getPath(config.build),
            wait: SERVER_WAIT_TIME // Wait for all changes, before reloading.
          }

          console.log(infoLog('Starting server'))

          startServer(options)
        }).on('change', async (path, stats) => {
          console.log(infoLog(`${path} has been changed`))

          await buildFile(path, config)
        })
    }
  })()
} catch (error) {
  console.log(errorLog(error.message))

  process.exit(1)
}
