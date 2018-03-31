const {spawn}=require('child_process');


const msg_worker=spawn(__dirname+'/../node_modules/.bin/nodemon',['--exec',__dirname+'/../node_modules/.bin/babel-node',__dirname+'./msgworkers/worker.js']);