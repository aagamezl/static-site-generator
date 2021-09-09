const liveServer = require('live-server')

const startServer = (options) => {
  liveServer.start(options)
}

module.exports = {
  startServer
}
