const mongoose = require('mongoose');
process.env.NODE_ENV = 'dev';



const models = require('../models/models');
const chai = require('chai');
const md5 = require('md5');

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getRandomBool = () => Math.random() > 0.5;
const constants = require('../constants');
const firstname = ['john', 'jetty'];
const lastName = ['young', 'sun', 'wu'];
// const courses = ['高等数学', '软件工程', '数据库', '欧洲现代美术', '马哲',"拉丁语","大学体育","信号与系统","计算机网络"];
const courses=[
    {c:'高等数学',d:'高等数学是比初等数学更高深的数学。有将中学里较深入的代数、几何以及集合论初步、逻辑初步统称为中等数学的，将其作为小学、初中的初等数学与本科阶段的高等数学之间的过渡。通常认为，高等数学的主要内容包括：极限理论、一元微积分学、多元微积分学、空间解析几何与向量代数、级数理论、常微分方程初步。在高等数学的教材中，以微积分学和级数理论为主体，其他方面的内容为辅，各类课本略有差异'},
    {c:'软件工程',d:'关于软件工程的定义，在GB/T11457-2006《信息技术 软件工程术语》中将其定义为"应用计算机科学理论和技术以及工程管理原则和方法，按预算和进度，实现满足用户要求的软件产品的定义、开发、和维护的工程或进行研究的学科"'},
    {c:'数据库',d:'数据库管理系统（英语：Database Management System，简称DBMS）是为管理数据库而设计的电脑软件系统，一般具有存储、截取、安全保障、备份等基础功能。数据库管理系统可以依据它所支持的数据库模型来作分类，例如关系式、XML；或依据所支持的电脑类型来作分类，例如服务器群集、移动电话；或依据所用查询语言来作分类，例如SQL、XQuery；或依据性能冲量重点来作分类，例如最大规模、最高运行速度；亦或其他的分类方式。不论使用哪种分类方式，一些DBMS能够跨类别，例如，同时支持多种查询语言'},
    {c:'欧洲现代美术',d:'现代艺术的范围很广泛，用来指从19世纪末期到大约1970年代大部份的艺术作品。（较近期的艺术作品通常被称作当代艺术或后现代艺术。）艺术原本的目的在于写实地再现某个主体，然而摄影的发明让艺术的写实功能相形见绌，于是就出现了新的艺术路线。艺术家开始实验各种观看的方式、材料、观点等等，而通常作品都变得越来越抽象。现代艺术的概念与现代主义有很亲密的关连'},
    {c:'马哲',d:'马克思主义哲学，简称“马哲”，是关于自然、社会和思维发展一般规律的科学，是唯物论和辩证法的统一、唯物论自然观和历史观的统一。它是一个相对真理。它是在继承和发展了德国的古典哲学、英国的古典政治经济学、英国、法国的空想社会主义下形成的马克思主义的三个组成部分之一。它的主要理论来源是辩证法和唯物论。辩证唯物主义和历史唯物主义是马克思主义的两大组成部分，实践概念是它的基础。    '},
    {c:"拉丁语",d:'拉丁语（Lingua Latīna）属于印欧语系意大利语族，最早在拉丁姆地区（意大利的拉齐奥区）和罗马帝国使用。虽然拉丁语通常被认为是一种死语言，但有少数基督宗教神职人员及学者可以流利使用拉丁语。罗马天主教传统上用拉丁语作为正式会议的语言和礼拜仪式用的语言。此外，许多西方国家的大学提供有关拉丁语的课程。'},
    {c:'大学体育',d:'在不同国家学校体育教学的任务及目标存在区别，在中国，学校体育是一项贯穿小学一年级到大学二年级的必修课程[1]，其任务可以概括为促进学生身心健康，掌握相应知识和技能，选拔后备人才，增强学生组织纪律性，锤炼学生顽强意志等'},
    {c:'信号与系统',d:'信号与系统是电子信息类的专业课，它的先修和基础课为高等数学、线性代数、概率论与数理统计、随机过程、矩阵论、电路分析基础、模拟电子线路、数学物理方程、高频电子线路、复变函数、大学物理'},
    {c:'计算机网络',d:'计算机网络，是指将地理位置不同的具有独立功能的多台计算机及其外部设备，通过通信线路连接起来，在网络操作系统，网络管理软件及网络通信协议的管理和协调下，实现资源共享和 [1]  信息传递的计算机系统'}

]

const course_desc = '据台湾媒体报道，歌手信（苏见信）和女友Wei Wei相恋15年却没结婚。女方被曝有新的追求者，她与对方的暧昧短信被信发现后，信生气搬离爱巢。这是又有男艺人被戴了绿帽子？';
const question_desc = [
    '脱口秀形式简单，一人拿着麦克在台上讲段子，逗大家笑，类似于单口喜剧或单口相声。随着信息时代的到来，能够坐在某某社喝着茶、听着段子已经是奢侈的事了，不是没钱买门票，而是没有时间。大家只能抽出碎片化时间，打开手机平板，权当消遣时光。而脱口秀形式活泼、利于传播，再加上《吐槽大会》这几个节目插上网络的翅膀，想不红都难。',
    '下午4时许，习近平来到老同志中间，全场响起热烈掌声。习近平同大家亲切握手，关切询问他们的身体和生活情况，共同回顾党的十八大以来党、国家、军队事业取得的历史性成就、发生的历史性变革。老同志们很振奋，一致表示要更加紧密地团结在以习近平同志为核心的党中央周围，全面深入贯彻党的十九大精神，以习近平新时代中国特色社会主义思想为指导，贯彻习近平强军思想，牢固树立“四个意识”，自觉坚定“三个维护”，满怀信心迎接强国强军新时代。',
    '习近平在贺电中指出，中意两国在电磁监测试验卫星项目合作中取得的重大成果，是中意全面战略伙伴关系的重要体现，将有力提升两国利用航天技术对地球电磁环境的监测能力和水平，为地震预警、防灾减灾发挥重要作用，服务两国经济社会发展。中方高度重视中意关系，愿同意方一道努力，加强两国各领域交流合作，推动中意全面战略伙伴关系深入发展，更好造福两国和两国人民。马塔雷拉在贺电中表示，电磁监测试验卫星的成功发射是两国重要合作成就，体现了双方在科研领域的坚实伙伴关系。意方愿同中方一道努力，推动各领域合作取得更多成果。',
    '其实赵雪妃这个名字，在观众的脑海中并未占有一席之地，但是说起她的艺名雪菲，对于喜欢怀旧的人而言，也许还藏有少许印象。有人因喜欢而演戏，有人为了名利而从艺，但是赵雪妃走上演艺的道路，则是属于阴差阳错纯属偶然。2002年，当时赵雪妃在广州读中专，恰逢张曼玉和梁朝伟主演的电影《英雄》在那里首映。主办方则在赵雪妃所在的学校，挑选几位礼仪小姐，赵雪妃在朋友的“怂恿”下报名参加，并最终通过层层选拔成功入选。'
]
const ans = '我是后来才知道这个事的，歌都做完了，一听才知道撞了。所有的评论我都是欢迎的，善恶终有报，天道好轮回。但唯独不能接受的就是抄袭指控这个事。对于我一个创作者来说，抄袭就是最高、最坏的指控了。所以你真要指控我抄袭，你要有充足的理由才行。过去三年我一直在说，你如果要判断一个歌手是不是抄袭，首先你要有一个判断标准，你先立一个标准起来，然后往上靠，发现一样的话，你就可以认为是符合这个标准的抄袭，不能一句旋律跟那个像就是抄的，如果照这个标准的话，全世界每首歌都会像另外几百首，那大家谁也别写歌了';
const comments = ['求不挂！', '你们就在此地不要走动，我去买几斤橘子', '真的秀', '秀！', '老师手下留情！'];
const question_comment=['很简单嘛','这题我做过的，书上有','我觉得这道题目参数有问题啊','楼上泥垢','天秀!']

const bulletins = ['明天放假', '要考试了', '明天运动会，调休', '你们在此地不要动，我去买几斤橘子'];
const drop = async () => {
    await mongoose.connect('mongodb://localhost:27017/welearn');
    await models.Live.drop();
    await models.Moment.drop();
    await models.Question.remove({});
    await models.Comment.remove({});
    await models.StuCourse.drop();
    await models.TeaCourse.drop();
    await models.MessageRecipient.drop();
    await models.Video.drop();
    await models.Message.drop();
    await models.Bulletin.drop();
    await models.QuestionDetail.drop();
    await models.Stu.drop();
    await models.Teacher.drop();

    await models.Course.drop();

    await models.UploadFile.drop();
};

const sync = async () => {

    await models.Stu.sync();
    await models.Teacher.sync();
    await models.Course.sync();
    await models.Video.sync();

    await models.StuCourse.sync();
    await models.TeaCourse.sync();
    await models.UploadFile.sync();
    await models.Bulletin.sync();
    await models.Message.sync();

    await models.MessageRecipient.sync();
    await models.QuestionDetail.sync();
    await models.Moment.sync();
    await models.Live.sync();

};



describe('prepare data', () => {
    before(async () => {
        await drop();
        await sync();
    });

    describe('insert course', () => {
        it('should insert course', async () => {
            for (let c of courses) {
                let saved = await models.Course.build({
                    name: c.c,
                    desc: c.d,
                }).save();
                //insert video
                for(let i=0;i<6;i++){
                    let saved_video=await models.Video.build({
                        course_id:saved.id,
                        name:`chapter ${i}`,
                        size:getRandomInt(3000,50000),
                        link:"api/video",
                        avatar:'common'+(i+1)%3+'.jpg',
                        upload_time:new Date().getTime(),
                    }).save();
                    let vN=`common${(i+1)%3}.jpg`;
                    await models._File.build({
                        aT: 11, aId: 1, forT: constants.ForT_Video, fId: saved_video.id, original_name: vN, name: vN, dir: vN, fT: constants.FT_IMAGE
                    }).save();

                }
                //
                // let key="private";
                // let md5=require('md5');
                // //insert live
                // for(let i=0;i<6;i++){
                //     let now=new Date().getTime();
                //     let time=now+(i+0.5)*24*60*60*1000;
                //     let expire=time/1000|0;
                //     let livekey=key;
                //     let course_id=saved.id;
                //
                //     let hash=md5(`/live/course${course_id}-${expire}-${livekey}`);
                //     let url=`/live/course${course_id}?sign=${expire}-${hash}`;
                //
                //
                //     await models.Live.build({
                //         course_id:saved.id,
                //         title:`Chapter ${i}`,
                //         time:time,
                //         url:url,
                //         is_going:false,
                //         finish:false,
                //     }).save();
                // }

                //insert question
                for (let i = 0; i < 3; i++) {
                    let question_image1 = 'common' + (i+1) % 3 + '.jpg';
                    let question_image2 = 'common' + (i + 2) % 3 + '.jpg';

                    let ans_image1 = 'common' + (i+1) % 3 + '.jpg';
                    let ans_image2 = 'common' + (i + 2) % 3 + 'jpg';
                    let saved_q = await new models.Question({
                        type: constants.QA,
                        cId: saved.id,
                        tId: 1,
                        body: question_desc[getRandomInt(0,question_desc.length)],
                        anss: [{ body: ans, images: [ans_image1, ans_image2] }],
                        images: [question_image1, question_image2],
                        //TODO:add file
                        publish_time: new Date().getTime() - (i+1) * 24 * 60 * 60 * 1000,
                        deadline:new Date().getTime()+i*24*60*60*1000,
                    }).save();
                    //insert question images
                    let question_file = { aT: 11, aId: 1, forT: constants.ForT_Question, fId: saved_q._id, fT: constants.FT_IMAGE };
                    question_file.original_name = question_image1; question_file.name = question_image1, question_file.dir = question_image1;
                    await models._File.build(question_file).save();
                    question_file.original_name = question_image2; question_file.name = question_image2, question_file.dir = question_image2;
                    await models._File.build(question_file).save();

                    //insert anss images
                    for (let ans of saved_q.anss) {
                        let ans_id = ans._id;
                        for (let ans_image of ans.images) {
                            await models._File.build({
                                aT: 11, aId: 1, forT: constants.ForT_Ans, fId: ans_id, original_name: ans_image, name: ans_image, dir: ans_image, fT: constants.FT_IMAGE
                            }).save();
                        }
                    }
                }
                //insert course image
                let filename = getRandomInt(1, 6) + '.jpg';
                let file = { aT: 11, aId: 1, forT: constants.ForT_Course, fId: saved.id, original_name: filename, name: filename, dir: filename, fT: constants.FT_IMAGE };
                await models._File.build(file).save();

            }
        });
    });
    describe('insert stus', () => {
        it('should insert stu', async () => {
            let i = 0;
            for (let fN of firstname) {
                for (let lN of lastName) {
                    let saved = await models.Stu.build({
                        name: lN + fN,
                        password: md5('pass'),
                        gender: i % 2 === 0 ? constants.MALE : constants.FEMALE,
                        avatar: 'avatar' + getRandomInt(1, 6) + '.jpg'
                    }).save();

                    //insert stucourse
                    for (let c = 0; c < courses.length; c++) {
                        if (getRandomBool()) {
                            let finished=getRandomBool()&&getRandomBool();
                            let score=finished?getRandomInt(60,100):null;
                            let stu_course = await models.StuCourse.build({
                                sId: saved.id,
                                cId: c + 1,
                                finished:finished,
                                score:score,
                            }).save();
                            //insert course comment
                            await new models.Comment({
                                forT: constants.ForT_Course,
                                forId: c + 1,
                                aT: constants.ACC_T_Stu,
                                aId: saved.id,
                                time: new Date().getTime() - i * 24 * 60 * 60 * 1000,
                                body: comments[getRandomInt(0, comments.length)]
                            }).save();

                            //insert question_comment
                            let questions=await models.Question.find({cId:stu_course.cId});
                            for(let q of questions){
                                await new models.Comment({
                                    forT:constants.ForT_Question,
                                    forId:q._id,
                                    aT:constants.ACC_T_Stu,
                                    aId:saved.id,
                                    time:new Date().getTime(),
                                    body:question_comment[getRandomInt(0,question_comment.length)]
                                }).save();
                            }
                        }
                    }
                    i++;
                }
            }
        });
    });


    describe('insert teachers', () => {
        it('should insert teachers', async () => {
            for (let lN of lastName) {
                let saved = await models.Teacher.build({
                    name: lN + 'tea',
                    password: md5('pass'),
                    gender: getRandomBool() ? constants.MALE : constants.FEMALE,
                    avatar: 'avatar' + getRandomInt(1, 6) + '.jpg'
                }).save();
            }

        });
    });

    describe('insert teacourse', () => {
        it('should insert teacourse', async () => {
            for (let c = 0; c < courses.length; c++) {
                let tea_course = await models.TeaCourse.build({
                    tId: getRandomInt(1, lastName.length),
                    cId: c + 1,
                }).save();
                //insert bulletin
                let count = getRandomInt(1, 3);
                for (let i = 0; i < count; i++) {
                    await models.Bulletin.build({
                        course_id: tea_course.cId,
                        publisher_id: tea_course.tId,
                        body: bulletins[getRandomInt(0, bulletins.length)],
                        publish_time: new Date().getTime() - i * 24 * 60 * 60 * 1000,
                    }).save();
                }
            }
        });
    });

});



