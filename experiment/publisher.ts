import { Buffer } from 'buffer';

const q = 'tasks';
(async () => {
  let id = 0;
  let conn = await require('../globals').mq;
  let channel = await conn.createChannel();
  if (await channel.assertQueue(q)) {
    setInterval(async () => {
      await channel.sendToQueue(q, new Buffer('hello world' + new Date().getTime()));
    }, 1000);
  }
})();

