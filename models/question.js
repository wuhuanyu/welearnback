const mongoose =require('mongoose');
const auto_increment=require('mongoose-auto-increment').plugin;
const AnsSchema=mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	body:String,
	images:[String],
	files:[String],
});

AnsSchema.plugin(auto_increment);
const QSchema=mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	type:Number,
	cId:Number,
	tId:Number,
	body:String,
	anss:{
		type:[AnsSchema],
	},
    
	time:Number,
});

QSchema.plugin(auto_increment,'question');
const Question= mongoose.model('question',QSchema,'questions');

Question.checkedFields=['type','cId','tId','body'];

module.exports = Question;