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

function addTcpClient(clientId,c) {
  if (getTcpClient(clientId) == "") {
    c.clientId = clientId;
    tcpClients.push(c);
  }
}

function getTcpClient(clientId) {
  var tcpClient = "";
  var found = 0;
  for(var i = 0; i < tcpClients.length && found == 0; i++) {
    if (tcpClients[i].clientId == clientId) {
      found = 1;
      tcpClient = tcpClients[i];
      log("TCP client " + clientId  + " found.");
    }
  }
  if (found == 0) {
    log("TCP client " + clientId  + " NOT found.");
  }
  return tcpClient;
}

// Pass TCP events to socket.io
function log(msg) {
  console.log(msg);
  logInfo = {log:msg};
  io.sockets.emit('log', logInfo);
}

// Hearbeat tracking over socket.io for TCP connections.
var beats = 0;
function tcpClientCount(details) {
  details.sequence = beats;
  details.tcpClients = tcpClients.length;
  beats++;
  log(details);
}

var udkBeats = 0;
function udkHeartbeat() {
  udkBeats++;
  var udkClient = getTcpClient("UDK");
  if (udkClient != "") {
    udkClient.write("HEARTBEAT");
    log("UDK HEARTBEAT");
  }
}

var tcpBeat = setInterval(tcpClientCount, 1000, {});
var udkBeat = setInterval(udkHeartbeat, 500);

// Handle TCP client connections.
var server = net.createServer(function(c) { //'connection' listener

  var clientId = "";
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
        addTcpClient("UDK",c);
        tcpClients[0].write("LEFT");
      } else if ( udkCommand == 'LEFTOFF') {
        log('UDK LEFTOFF');
        addTcpClient("UDK",c);
        tcpClients[0].write("LEFTOFF");
      } else if ( udkCommand == 'RIGHT' ) {
        log('UDK RIGHT');
        addTcpClient("UDK",c);
        tcpClients[0].write('RIGHT');
      } else if ( udkCommand == 'RIGHTOFF' ) {
        log('UDK RIGHTOFF');
        addTcpClient("UDK",c);
        tcpClients[0].write('RIGHTOFF');
      } else if ( udkCommand == 'UP' ) {
        log('UDK UP');
        addTcpClient("UDK",c);
        tcpClients[0].write('UP');
      } else if ( udkCommand == 'DOWN' ) {
        log('UDK DOWN');
        addTcpClient("UDK",c);
        tcpClients[0].write('DOWN');
      } else if ( udkCommand == 'TRUCK' ) {
        log('UDK TRUCK');
        addTcpClient("UDK",c);
        tcpClients[0].write('TRUCK');
      } else if ( udkCommand == 'BOAT' ) {
        log('UDK BOAT');
        addTcpClient("UDK",c);
        tcpClients[0].write('BOAT');
      } else if ( udkCommand == 'MAGNET' ) {
        log('UDK MAGNET');
        addTcpClient("UDK",c);
        tcpClients[0].write('MAGNET');
      } else {
        //Not a UDK command.
        var data = JSON.parse(data.toString());
        if (data == 'undefined') {
          log('Recieved garbage.');
        } else {
          log(data);
          addTcpClient("ARDUINO",c);
        }
      }
    } catch (er) {
      log('Cannot parse garbage.');
    }
  });

  if (clientId != "") {
  } else {
    log("clientId is blank");
  } 

});
server.listen(8124, function() {
  console.log('TCP server bound');
});

console.log('HTTP Server running at http://127.0.0.1:1350/');
