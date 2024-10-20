// Answer Document Schema
var mongoose = require('mongoose');
var AnswersSchema = new mongoose.Schema({
    text: {type:String, required: true},
    ans_by: {type: String, required: true},
    ans_date_time: {type: Date, default: Date.now},
    views: {type:Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    votes: {type:Number, default:0},
});

AnswersSchema
.virtual('url')
.get(function () {
  return '/posts/question/' + this._id;
});

module.exports = mongoose.model('Answer', AnswersSchema);