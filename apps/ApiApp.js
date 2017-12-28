const ApiApp=require('express')();
const Qrouter= require('../routes/QRoute');

ApiApp.use("/question",Qrouter);

module.exports=ApiApp;