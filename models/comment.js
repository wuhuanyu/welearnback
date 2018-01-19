const mongoose = require('mongoose');
const auto_increment=require('mongoose-auto-increment').plugin;
const CommentSchema = mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	//for question or course
	forT:Number,
	// question id or course id 
	forId:String,

	aT: Number,//authorType
	aId: Number,//authorId

	time: Number,
	body: String,
});
CommentSchema.plugin(auto_increment,'comment');
const Comment = mongoose.model('comment', CommentSchema, 'comments');
Comment.checkedFields=['forT','forId','aT','aId','body'];
module.exports=Comment;