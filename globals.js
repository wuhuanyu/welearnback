const mqtt=require('mqtt');
const mqtt_client=mqtt.connect('tcp://localhost',{clientId:'welearn_back'});
// mqtt_client.on('connect',()=>{
// 	console.log('mqtt connect to message broker');
// });


const open=require('amqplib').connect('amqp://localhost');
module.exports={
    mqtt_client,
    mq:open
};