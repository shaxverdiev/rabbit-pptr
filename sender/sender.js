const amqp = require('amqplib/callback_api');

// 1: Create Connection
amqp.connect('amqp://localhost', (connError, connection) => {
  if (connError) {
    throw connError;
  }
  // 2: Create Channel
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }
    // 3: Assert Queue
    const QUEUE = 'codingtest';
    channel.assertQueue(QUEUE);
    //  4: Send message to queue
    channel.sendToQueue(QUEUE, Buffer.from('http://localhost:7000/set-cookie'));
    console.log(`Message send ${QUEUE}`);
  });
});
