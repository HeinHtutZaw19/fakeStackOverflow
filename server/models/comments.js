// Comment Document Schema
var mongoose = require('mongoose');
var CommentsSchema = new mongoose.Schema({
    text: {type:String, required: true},
    cmt_by: {type: String, required: true},
    cmt_date_time: {type: Date, default: Date.now},
    votes: {type:Number, default: 0}
});

module.exports = mongoose.model('Comment', CommentsSchema);