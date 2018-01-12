const mosca=require('mosca');

const storage={
  type:'mongo',
  url:'mongodb://localhost:27017/welearn',
  pubsubCollection:'pub_sub',
  mongo:{}
};

const settings={
  port:1883,
  backend:storage,
};

const server=new mosca.Server(settings);

server.on('clientConnected',(client)=>{
  console.log('client connected',client.id);
});

server.on('published',(packet,client)=>{
  // console.log('published',packet.payload);
  console.log(" payload: "+packet.payload.toString("ascii"));
  // console.log("client:"+);
  
});

server.on('ready',()=>console.log('Mosca server is up and running'));