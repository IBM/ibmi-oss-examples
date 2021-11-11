var http = require('http');
var https = require('https'); // If need wss support
var fs = require('fs');
var url = require('url');
var WebSocketServer = require('websocket').server;

// If need wss support
var options = {
  key: fs.readFileSync('privateKey.key'),
  cert: fs.readFileSync('certificate.crt')
};

function respond(req, res) {
  console.log((new Date()) + ' Received request for ' + req.url);
  var realPath = __dirname + url.parse(req.url).pathname;
  fs.exists(realPath, function(exists){
    if(exists){
      var file = fs.createReadStream(realPath);
      res.writeHead(200, {'Content-Type': 'text/html'});
      file.on('data', res.write.bind(res));
      file.on('close', res.end.bind(res));
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("404 Not Found");
    }
  });
}
var server = http.createServer(respond);
var sserver = https.createServer(options, respond); // If need wss support
var wsServer = new WebSocketServer({
  httpServer: [server, sserver], // If need both ws and wss support, use this.
  // httpServer: server,  // If only need ws support, use this.
  autoAcceptConnections: false
});
wsServer.on('request', function(request) {
  var path = require('url').parse(request.resource).pathname;
  console.log((new Date()) + ' Received request for ' + path + '.');
  var connection = request.accept(null, request.origin);
  var addr = connection.socket.localAddress;
  console.log((new Date()) + ' Peer ' + connection.remoteAddress + "connected.");
  connection.sendUTF("[From Server] Connected to " + addr);
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
        console.log((new Date()) + ' Received Message: ' + message.utf8Data);
        connection.sendUTF("[From Server] " + message.utf8Data);
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
server.listen(8888, function() {
   console.log((new Date()) + ' HTTP Server is listening on port 8888');
});
// If need wss support
sserver.listen(8889, function() {
   console.log((new Date()) + ' HTTPS Server is listening on port 8889');
});