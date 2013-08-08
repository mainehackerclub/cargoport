var http = require('http');
var static = require('node-static');
var file = new(static.Server)('.');
var net = require('net');
var tcpClients = [];

// Create HTTP server
var serv = http.createServer(function (req, res) {
    log('HTTP Connection');
    req.addListener('end', function () {
    // Serve files!
        file.serve(req, res);
    });
}).listen(8081, 'awesomesauce.me');

// Initialize Socket.io
var io = require('socket.io').listen(serv);
io.set('log level',1);

//Pass socket.io events to TCP streams.
io.sockets.on('connection', function(socket) {
  socket.on('command',function(data) {
    log(data);
    tcpClients[0].write(JSON.stringify(data));
  });
});

// Pass TCP events to socket.io
function log(msg) {
  console.log(msg);
  logInfo = {log:msg};
  io.sockets.emit('log', logInfo);
}

// Handle TCP client connections.
var server = net.createServer(function(c) { //'connection' listener

  log('TCP client connected');
  c.on('end', function() {
    log('TCP client disconnected');
    tcpClients.pop();
  });

  c.on('data', function(data) {
    try
    {
      //Is is a UDK command or a JSON object?
      var udkCommand = data.toString();
      if ( udkCommand == 'LEFT') {
        log('UDK LEFT');
        tcpClients[0].write("LEFT");
      } else if ( udkCommand == 'LEFTOFF') {
        log('UDK LEFTOFF');
        tcpClients[0].write("LEFTOFF");
      } else if ( udkCommand == 'RIGHT' ) {
        log('UDK RIGHT');
        tcpClients[0].write('RIGHT');
      } else if ( udkCommand == 'RIGHTOFF' ) {
        log('UDK RIGHTOFF');
        tcpClients[0].write('RIGHTOFF');
      } else if ( udkCommand == 'UP' ) {
        log('UDK UP');
        tcpClients[0].write('UP');
      } else if ( udkCommand == 'DOWN' ) {
        log('UDK DOWN');
        tcpClients[0].write('DOWN');
      } else if ( udkCommand == 'TRUCK' ) {
        log('UDK TRUCK');
        tcpClients[0].write('TRUCK');
      } else if ( udkCommand == 'BOAT' ) {
        log('UDK BOAT');
        tcpClients[0].write('BOAT');
      } else if ( udkCommand == 'MAGNET' ) {
        log('UDK MAGNET');
        tcpClients[0].write('MAGNET');
      } else {
        //Not a UDK command.
        var data = JSON.parse(data.toString());
        if (data == 'undefined') {
          log('Recieved garbage.');
        } else {
          log(data);
        }
      }
    } catch (er) {
      log('Cannot parse garbage.');
    }
  });

  //c.pipe(c);
  tcpClients.push(c);
});
server.listen(8124, function() {
  console.log('TCP server bound');
});

console.log('HTTP Server running at http://127.0.0.1:1350/');
