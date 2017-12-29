
const ApiApp=require('express')();
const Qrouter= require('../routes/qrouter');
const AccRouter=require('../routes/accrouter');

ApiApp.use("/question",Qrouter);
ApiApp.use('/acc',AccRouter);


module.exports=ApiApp;