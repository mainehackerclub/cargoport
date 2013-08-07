var http = require('http');
var static = require('node-static');
var file = new(static.Server)('.');
var net = require('net');
var tcpClients = [];

// Create HTTP server
var serv = http.createServer(function (req, res) {
    console.log('HTTP Connection');
    req.addListener('end', function () {
    // Serve files!
        file.serve(req, res);
    });
}).listen(1350);

// Initialize Socket.io
var io = require('socket.io').listen(serv);
io.set('log level',1);

//Pass socket.io events to TCP streams.
io.sockets.on('connection', function(socket) {
  socket.on('ledOn',function(data) {
    console.log(data);
    tcpClients[0].write(JSON.stringify(data));
  });
  socket.on('ledOff',function(data) {
    tcpClients[0].write(JSON.stringify(data));
    console.log(data);
  });
  socket.on('servo',function(data) {
    console.log(data);
    tcpClients[0].write(JSON.stringify(data));
  });
});

// Pass TCP events to socket.io
function heartbeat(data) {
  io.sockets.emit('board',data);
}

// Handle TCP client connections.
var server = net.createServer(function(c) { //'connection' listener

  console.log('TCP client connected');
  c.on('end', function() {
    console.log('TCP client disconnected');
    tcpClients.pop();
  });

  c.on('data', function(data) {
    try
    {
      //Is is a UDK command or a JSON object?
      var udkCommand = data.toString();
      if ( udkCommand == 'LEFT') {
        console.log('UDK LEFT');
        tcpClients[0].write("LEFT");
      } else if ( udkCommand == 'LEFTOFF') {
        console.log('UDK LEFTOFF');
        tcpClients[0].write("LEFTOFF");
      } else if ( udkCommand == 'RIGHT' ) {
        console.log('UDK RIGHT');
        tcpClients[0].write('RIGHT');
      } else if ( udkCommand == 'RIGHTOFF' ) {
        console.log('UDK RIGHTOFF');
        tcpClients[0].write('RIGHTOFF');
      } else if ( udkCommand == 'UP' ) {
        console.log('UDK UP');
        tcpClients[0].write('UP');
      } else if ( udkCommand == 'DOWN' ) {
        console.log('UDK DOWN');
        tcpClients[0].write('DOWN');
      } else if ( udkCommand == 'TRUCK' ) {
        console.log('UDK TRUCK');
        tcpClients[0].write('TRUCK');
      } else if ( udkCommand == 'BOAT' ) {
        console.log('UDK BOAT');
        tcpClients[0].write('BOAT');
      } else if ( udkCommand == 'MAGNET' ) {
        console.log('UDK MAGNET');
        tcpClients[0].write('MAGNET');
      } else {
        //Not a UDK command.
        var data = JSON.parse(data.toString());
        if (data == 'undefined') {
          console.log('Recieved garbage.');
        } else {
          console.log(data);
          heartbeat(data);
        }
      }
    } catch (er) {
      console.log('Cannot parse garbage.');
    }
  });

  //c.pipe(c);
  tcpClients.push(c);
});
server.listen(7124, function() {
  console.log('TCP server bound');
});

console.log('HTTP Server running at http://127.0.0.1:1350/');
