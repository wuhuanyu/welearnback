const {spawn} =require('child_process');



const sender=spawn('node',[__dirname+'/msgsender_test.js']);
// console.log(__dirname);

sender.on('exit',(code,signal)=>{
    console.log(`Sender exited with ${code} and signal ${signal}`);
});

sender.stdout.on('data',(data)=>{
    console.log(`stdout data from sender ${data}`);
});

// const worker=spawn('node',[__dirname+'/msgworker_test.js']);

// worker.stdout.on('data',(data)=>{
//     console.log(`stdout data from worker ${data}`);
// });