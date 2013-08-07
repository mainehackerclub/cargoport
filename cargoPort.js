var five = require("johnny-five");
var board  = new five.Board();
var util = require('util'),
    net = require('net');
// Global variables for active digital pins.
var BOOM = 8,
    HOIST = 11,
    BOAT = 12,
    TRUCK = 10,
    MAGNET = 9;
var SERVOS   = [BOOM, HOIST, BOAT, TRUCK];
    jServos = [];

var boomInterval;

function makeServo(opts) {
  var servo = new five.Servo(opts.pin);
  servo.name = opts.pin;
  jServos.push(servo);
  console.log('created Servo on pin '+opts.pin);
  return servo;
}

// Find Servo given a pin
function getServo(name) {
  var found = '';
  for (i in jServos) {
    if (jServos[i].name == name) {
      found = jServos[i];
    }
  }
  return found;
}
// Initialize array of Servo objects.
function setServos() {
  //BOOM
  var boomOpts = {pin:BOOM,
                  range:[0,180],
                  type:"standard",
                  center:false};
  var boom = makeServo(boomOpts);
  boom.label = "BOOM";
  boom.pos = 90;
  boom.pace =  75;
  boom.increment = 2.5;
  boom.steps = 0;
  //HOIST
  var hoistOpts = {pin:HOIST,
                  range:[0,180],
                  type:"standard",
                  center:false};
  var hoist = makeServo(hoistOpts);
  hoist.label = "HOIST";
  hoist.pos = 180;
  //BOAT
  var boatOpts = {pin:BOAT,
                  range:[0,360],
                  type:"continuous",
                  center:false};
  var boat = makeServo(boatOpts);
  boat.label = "BOAT";
  boat.pos = 89;
  //TRUCK
  var truckOpts = {pin:TRUCK,
                  range:[0,360],
                  type:"continuous",
                  center:false};
  var truck = makeServo(truckOpts);
  truck.label = "TRUCK";
  truck.pos = 89;
  console.log('Move in 3 seconds...');
  setTimeout(initialMove(),1000);
}

function initialMove() {
  var boat = getServo(BOAT);
  boat.move(boat.pos);
  var boom = getServo(BOOM);
  boom.move(boom.pos);
  var hoist = getServo(HOIST);
  hoist.move(hoist.pos);
  var truck = getServo(TRUCK);
  truck.move(truck.pos);
  console.log('Setting initial servo positions.');
}

// Hearbeat tracking
var beats = 0;
function heartbeat(details,client) {
  details.sequence = beats;
  beats++;
  console.log(JSON.stringify(details));
  client.write(JSON.stringify(details));
}

function goToZero(servo) {
  console.log('goToZero {'+servo.pos+','+servo.label+','+servo.steps+'}');
  if (servo.pos > 0) {
    servo.move(servo.pos-servo.increment);
    servo.pos=servo.pos-servo.increment;
    servo.steps = servo.steps - 1;
  } else {
    clearInterval(boomInterval);
  }
}

function goToMax(servo) {
  console.log('goToMax {'+servo.pos+','+servo.label+','+servo.steps+'}');
  if (servo.pos < 180) {
    servo.move(servo.pos+servo.increment);
    servo.pos=servo.pos+servo.increment;
    servo.steps = servo.steps - 1;
  } else {
    clearInterval(boomInterval);
  }
}


// Define arduino behavior.
board.on("ready", function() {
  var boardDeets = {};
  boardDeets.uniqueId = "123456789XABCD";
  boardDeets.name = "CARGO_PORT";
  console.log('Board is ready');
  setServos();

  // Make TCP connection as client.
  var client = net.connect(
    {host:'awesomesauce.me',port:'8124'},
   // {host:'localhost',port:'8130'},
    function() {//'connect' listener
      console.log('TCP client connected');
      client.write(JSON.stringify(boardDeets));
    }
  );
  
  var hbInterval = setInterval(heartbeat,5000,boardDeets,client),
      boom = getServo(BOOM),
      hoist = getServo(HOIST),
      boat = getServo(BOAT);
  
  // Process data from TCP Server.
  client.on('data', function(data) {
    try {
      var udkCommand = data.toString();
      console.log('udkCommand: '+udkCommand);
      if (udkCommand == 'LEFT') {
        console.log('moving to Left.');
        boom.steps = 3;
        clearInterval(boomInterval);
        boomInterval = setInterval(goToZero,boom.pace,boom);
      } else if (udkCommand == 'LEFTOFF') {
        boom.steps = 0;
        clearInterval(boomInterval);
      } else if (udkCommand == 'RIGHT') {
        console.log('moving to Right.');
        boom.steps = 3;
        clearInterval(boomInterval);
        boomInterval = setInterval(goToMax,boom.pace,boom);
      } else if (udkCommand == 'RIGHTOFF') {
        boom.steps = 0;
        clearInterval(boomInterval);
      } else if (udkCommand == 'UP') {
        hoist.max();
        console.log('moving upward.');
      } else if (udkCommand == 'DOWN') {
        hoist.min();
        console.log('moving downward.');
      } else if (udkCommand == 'BOAT') {
        boat.move(boat.pos+15);
      } else {
        var data = JSON.parse(data.toString());
        console.log('Received TCP JSON data: '+util.inspect(data));
        if (data.component == 'servo') {
          var servo = getServo(data.pin);
          if (data.pos === 'min') {
            servo.max();
          } else if (data.pos === 'max') {
            servo.min();
          } else {
            servo.move(data.pos);
          }
        }
      }
    } catch (err) {
        console.log('Cannot process garbage.');
    }

   // client.end();
  });

  // Handle TCP end.
  client.on('end',function() {
    console.log('TCP client disconnected');
  });

});

console.log('Waiting for Arduino to be ready.');
