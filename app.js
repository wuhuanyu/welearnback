var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
const mongoose = require('mongoose');

const ApiApp = require('./apps/ApiApp');
const WebApp = require('./apps/WebApp');
const auto_increment = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test')
    mongoose.connect('mongodb://localhost:27017/welearn', { useMongoClient: true });
else mongoose.connect('mongodb://localhost:27017/welearn_test');

// mongoose.connection.once('open', () => {
// 	auto_increment.initialize(mongoose.connection);
// });


app.use(morgan('dev'));
app.use('/images', express.static('uploads/images'));
app.use('/avatars',express.static('uploads/avatars'));
app.use('/', WebApp);
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', ApiApp);

app.use(express.static(path.join(__dirname, 'public')));





// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    res.status(err.code || 500).end();
});

module.exports = app;
