const mongoose =require('mongoose');
import * as constants from '../constants';
import findByFieldFactory from '../utils/commonquery';
const QSchema=mongoose.Schema({
    type:Number,
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
    // abcd:[],
    /**
     * 选择题正确答案,问答题正确答案
     */
    ans:{},
    time:Number,
});

const Question= mongoose.model('question',QSchema,'questions');
Question.checkedFields=['type','cId','tId','body','ans'];


module.exports = Question;