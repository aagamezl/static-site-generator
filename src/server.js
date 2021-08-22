const liveServer = require('live-server')

const server = (options) => {
  liveServer.start(options)
}

module.exports = {
  server
}
