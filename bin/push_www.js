#!/usr/bin/env node

const http=require('http');
var debug = require('debug')('welearnback:server');
const app=require('../push_service');


app.set('port',normalizePort('3001'));
const server=http.createServer(app);
const io=require('socket.io')(server);

io.on('connection',(socket)=>{
    console.log('a user connected');
});


global.io=io;



server.listen(normalizePort('3001'));
server.on('error',onError);
server.on('listening',onListening);


app.post('/push',(req,res,next)=>{
  io.emit('msg',JSON.stringify(req.body));
  res.json({
    msg:"Message send"
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

process.on('uncaughtException',(e)=>{
  console.log(e);
});