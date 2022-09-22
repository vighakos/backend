const http = require('http');
const { getEnabledCategories } = require('trace_events');

const requestListener = function (req, res) {
  res.writeHead(200);
  res.write('2414 szadftt sopotszer fajelsztő')
  res.end('\nHello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);