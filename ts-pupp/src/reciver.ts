import amqp from 'amqplib/callback_api';
import puppeteer from 'puppeteer';

console.log('app start.......')
function start() {
  // 1: Create Connection
  amqp.connect('amqp://localhost', (connError: any, connection: any) => {
    if (connError) {
      throw connError;
    }
    // 2: Create Channel
    connection.createChannel((channelError: any, channel: any) => {
      if (channelError) {
        throw channelError;
      }
      //  3: Assert Queue
      const QUEUE = 'codingtest';
      channel.assertQueue(QUEUE);

      // 4: Receive Messages
      channel.consume(
        QUEUE,
        (msg: any) => {
          // test (URL from QUEUE)
          console.log(`Message received: ${msg.content.toString()}`);
          const messFromQueue = msg.content.toString();
          const url = messFromQueue;

          // START PUPPETEER
          async function run() {
            let browser = await puppeteer.launch({ headless: true });
            let page = await browser.newPage();
            await page.goto(url);

            const task = await page.evaluate(() => {
              return {
                cookie: document.cookie,
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
              };
            });
            console.log(task);

            await page.close();
            await browser.close();
          }
          run();
          //////////////////////////////////////////////////////////////////end pptr
        },
        {
          noAck: true,
        }
      );
    });
  });
}

start();
