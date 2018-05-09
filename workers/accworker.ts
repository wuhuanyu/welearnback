import * as Redis from 'redis';
import * as BlueBird from 'bluebird';
import * as constants from '../constants';
import * as models from '../models/models';


async function monitorAcc() {
    let client = Redis.createClient();
    client.subscribe('__keyevent@0__:expired');//订阅redis 缓存条目删除事件
    client.on('message', async (channel, message) => {
        let key: string = message.toString();
        try {
            // 取出type:user:id
            let info: Array<string> = key.split(":");
            let type: Number = +(info[0]); let id: Number = +(info[2]);
            let model;
            if (type === constants.ACC_T_Tea)
                model = models.Teacher;
            else model = models.Stu;
            let found=await model.findOne({
                where:{
                    id:id
                }
            });
            if(found){
                //更新数据库
                await found.update({
                    //设置登出，token置空
                    login:false,
                    token:0,
                })
            };
        } catch (e) {
        }
    });
}


monitorAcc();