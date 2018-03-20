const q='msg';

const worker=async function () {
    let conn=await require('amqplib').connect('amqp://localhost');
    let channel=await conn.createChannel();
    let ok=await channel.assertQueue(q);
    await channel.consume(q,async function(msg){
        console.log(msg.content.toString());
        channel.ack(msg);
    });

};

worker(); 