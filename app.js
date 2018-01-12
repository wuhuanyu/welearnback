var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
const mongoose=require('mongoose');

const ApiApp=require('./apps/ApiApp');
const WebApp=require('./apps/WebApp');
mongoose.connect("mongodb://localhost:27017/welearn",(err)=>{

});


mongoose.Promise=global.Promise;

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

app.use('/images',express.static('uploads/images'));
app.use('/', WebApp);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1',ApiApp);

app.use(express.static(path.join(__dirname, 'public')));



// app.use('/question',Qrouter);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   console.log(err.code);
//   res.status(err.code||500).json({
//     msg:err.msg||err.message,
//   })
// });
app.use((err,req,res,next)=>{
  res.status(err.code||500).end();
})

module.exports = app;
