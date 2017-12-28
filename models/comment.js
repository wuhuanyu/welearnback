const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    qId: Number,
    aT: Number,
    aId: Number,
    time: Number,
    body: String,
});

const Comment = mongoose.model('comment', CommentSchema, 'comments');
module.exports=Comment;