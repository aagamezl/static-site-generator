const liveServer = require('live-server')

/**
 * Start the server
 *
 * @param {object} options
 */
const startServer = (options) => {
  liveServer.start(options)
}

module.exports = {
  startServer
}
