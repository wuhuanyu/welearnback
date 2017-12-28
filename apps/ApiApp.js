const ApiApp=require('express')();
const Qrouter= require('../routes/qrouter');

ApiApp.use("/question",Qrouter);

module.exports=ApiApp;