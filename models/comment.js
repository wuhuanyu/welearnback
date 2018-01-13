const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
	_id:String,
	//for question or course
	forT:Number,
	// question id or course id 
	forId:String,

	aT: Number,//authorType
	aId: Number,//authorId

	time: Number,
	body: String,
});
const Comment = mongoose.model('comment', CommentSchema, 'comments');
Comment.checkedFields=['forT','forId','aT','aId','body'];
module.exports=Comment;