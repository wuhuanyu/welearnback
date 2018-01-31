const mongoose =require('mongoose');
const auto_increment=require('mongoose-auto-increment');
const AnsSchema=mongoose.Schema({
    body:String,
    images:[String],
    files:[String],
});
// auto_increment.initialize(mongoose.connection);
// AnsSchema.plugin(auto_increment.plugin);
const QSchema=mongoose.Schema({
    type:Number,
    cId:Number,
    tId:Number,
    body:String,
    anss:{
        type:[AnsSchema],
    },
    images:[String],
    files:[String],
    time:Number,
});

auto_increment.initialize(mongoose.connection);
QSchema.plugin(auto_increment.plugin,{model:'question',field:'_id'});
AnsSchema.plugin(auto_increment.plugin,{model:'question',field:'_id'});

const Question= mongoose.model('question',QSchema,'questions');
Question.checkedFields=['type','cId','tId','body'];

module.exports = Question;