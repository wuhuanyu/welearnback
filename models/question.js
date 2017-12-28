const mongoose =require('mongoose');
const ObjectID=mongoose.Objectid();
import * as constants from '../constants';
const QSchema=mongoose.Schema({
    type:String,
    /**
     * course id
     * teacher id
     */
    cId:Number,
    tId:Number,
    body:String,
    /**
     * 选择题abcd
     */
    abcd:[],
    /**
     * 选择题正确答案,问答题正确答案
     */
    ans:{},
    time:Number,
});

const Question= mongoose.model('question',QSchema,'questions');

module.exports = Question;