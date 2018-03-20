const app=require('../timeline/timeline_processor');

const http=require('http');

// const port=normalizePort('3002');
app.set('port',3002);

const server=http.createServer(app);

server.listen(3002);
server.on('listening',()=>{
    console.log('timeline_api is working');
});