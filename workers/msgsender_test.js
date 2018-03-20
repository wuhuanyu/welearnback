
const q = 'msg';

const sender = async function () {
    const conn=await require('amqplib').connect('amqp://localhost');
    const channel=await conn.createChannel();
    let ok=await channel.assertQueue(q);
    setInterval(async function(){
        console.log('start sending');
        await channel.sendToQueue(q,new Buffer('this is msg'+new Date()));
    },3000);

};

sender();




