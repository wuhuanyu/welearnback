const mongoose =require('mongoose');
const AnsSchema=mongoose.Schema({
	_id:String,
	body:String,
	images:[String],
	files:[String],
});
const QSchema=mongoose.Schema({
	_id:String,
	type:Number,
    
	cId:Number,
	tId:Number,
	body:String,
	anss:{
		type:[AnsSchema],
		// default:[{body:"demo ans"}],
	},
    
	time:Number,
});

const Question= mongoose.model('question',QSchema,'questions');
Question.checkedFields=['type','cId','tId','body'];


module.exports = Question;