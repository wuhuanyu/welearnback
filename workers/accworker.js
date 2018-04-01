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
const Redis = require("redis");
const constants = require("../constants");
const models = require("../models/models");
function monitorAcc() {
    return __awaiter(this, void 0, void 0, function* () {
        let client = Redis.createClient();
        client.subscribe('__keyevent@0__:expired');
        client.on('message', (channel, message) => __awaiter(this, void 0, void 0, function* () {
            let key = message.toString();
            try {
                let info = key.split(":");
                let type = +(info[0]);
                let id = +(info[2]);
                let model;
                if (type === constants.ACC_T_Tea)
                    model = models.Teacher;
                else
                    model = models.Stu;
                let found = yield model.findOne({
                    where: {
                        id: id
                    }
                });
                if (found) {
                    yield found.update({
                        login: false,
                        token: 0,
                    });
                }
                ;
            }
            catch (e) {
            }
        }));
    });
}
monitorAcc();
