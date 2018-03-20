
const mqtt=require('mqtt');
const mqtt_client=mqtt.connect('tcp://localhost',{clientId:'welearn_back'});
<<<<<<< HEAD
const redis=require('redis');

const bluebird=require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client=redis.createClient();

const msg_queue=(async()=>{
    const connection=await require('amqplib').connect('amqp://localhost');
    const channel=await connection.createChannel();
    let ok=await channel.assertQueue('msg');
    return channel;
})();

const timeline_queue=(async()=>{
    const connection=await require('amqplib').connect('amqp://localhost');
    const channel=await connection.createChannel();
    let ok=await channel.assertQueue('timeline');
    return channel;
})();


module.exports={
    mqtt_client,
    msg_queue:msg_queue,
    timeline_queue:timeline_queue,
    redis:client,
=======
// mqtt_client.on('connect',()=>{
// 	console.log('mqtt connect to message broker');
// });


const open=require('amqplib').connect('amqp://localhost');
module.exports={
    mqtt_client,
    mq:open
>>>>>>> 56bf8aea83c72e6a2c923fab470d68a9e0706a06
};