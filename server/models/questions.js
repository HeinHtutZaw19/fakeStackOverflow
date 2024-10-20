// Question Document Schema
var mongoose = require('mongoose');
var QuestionsSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 50},
    text: {type:String, required: true},
    summary: {type:String, required: true, maxLength: 140},
    tags: {type:[{type: mongoose.Schema.Types.ObjectId, ref: 'Tags'}], required:true},
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    asked_by: {type:String, default:'Anonymous'},
    ask_date_time: {type: Date, default: Date.now},
    views: {type:Number, default: 0},
    votes: {type:Number, default: 0},
});

QuestionsSchema
.virtual('url')
.get(function () {
  return '/posts/answer/' + this._id;
});

module.exports = mongoose.model('Question', QuestionsSchema);