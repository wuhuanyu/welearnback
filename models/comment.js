const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    qId: Number,//question
    aT: Number,//authorType
    aId: Number,//authorId
    time: Number,
    body: String,
});

const Comment = mongoose.model('comment', CommentSchema, 'comments');
module.exports=Comment;