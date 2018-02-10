
const q="tasks";
(async()=>{
    let conn=await require('../globals').mq;    
    let chn=await conn.createChannel();
    if(await chn.assertQueue(q)){
        await chn.consume(q,(msg)=>{
            if(msg!=null){
                console.log(msg.content.toString());
                chn.ack(msg);
            }
        });
    }
})();