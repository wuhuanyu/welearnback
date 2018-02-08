"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const q = 'tasks';
(() => __awaiter(this, void 0, void 0, function* () {
    let id = 0;
    let conn = yield require('./globals').mq;
    let channel = yield conn.createChannel();
    if (yield channel.assertQueue(q)) {
        yield channel.sendToQueue(q, new buffer_1.Buffer('hello world' + new Date().getTime()));
    }
}))();
