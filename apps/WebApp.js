const app=require('express')();
const path=require('path');
const favicon = require('serve-favicon');
const webrouter=require('../routes/webrouter');
app.set('views',path.join(__dirname,'../views'));
app.set('view engine','ejs');

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use('/',webrouter);
module.exports=app;