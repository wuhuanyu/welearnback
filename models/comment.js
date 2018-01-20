const mongoose = require('mongoose');
const auto_increment=require('mongoose-auto-increment');
const CommentSchema = mongoose.Schema({
	//for question or course
	forT:Number,
	// question id or course id 
	forId:String,

	aT: Number,//authorType
	aId: Number,//authorId

	time: Number,
	body: String,
});
auto_increment.initialize(mongoose.connection);

CommentSchema.plugin(auto_increment.plugin,'comment');
const Comment = mongoose.model('comment', CommentSchema, 'comments');
Comment.checkedFields=['forT','forId','aT','aId','body'];
module.exports=Comment;