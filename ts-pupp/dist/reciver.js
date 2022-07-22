"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const puppeteer_1 = __importDefault(require("puppeteer"));
console.log('app start.......');
function start() {
    // 1: Create Connection
    callback_api_1.default.connect('amqp://localhost', (connError, connection) => {
        if (connError) {
            throw connError;
        }
        // 2: Create Channel
        connection.createChannel((channelError, channel) => {
            if (channelError) {
                throw channelError;
            }
            //  3: Assert Queue
            const QUEUE = 'codingtest';
            channel.assertQueue(QUEUE);
            // 4: Receive Messages
            channel.consume(QUEUE, (msg) => {
                // test (URL from QUEUE)
                console.log(`Message received: ${msg.content.toString()}`);
                const messFromQueue = msg.content.toString();
                const url = messFromQueue;
                // START PUPPETEER
                function run() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let browser = yield puppeteer_1.default.launch({ headless: true });
                        let page = yield browser.newPage();
                        yield page.goto(url);
                        const task = yield page.evaluate(() => {
                            return {
                                cookie: document.cookie,
                                width: document.documentElement.clientWidth,
                                height: document.documentElement.clientHeight,
                            };
                        });
                        console.log(task);
                        yield page.close();
                        yield browser.close();
                    });
                }
                run();
                //////////////////////////////////////////////////////////////////end pptr
            }, {
                noAck: true,
            });
        });
    });
}
start();
