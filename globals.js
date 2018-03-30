
const mqtt=require('mqtt');
const mqtt_client=mqtt.connect('tcp://localhost',{clientId:'welearn_back'});
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
};