
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let Question = require('../models/questions');
let User = require('../models/users');

exports.show_answer = async(res, id) => {
    let doc = await Answer.findById(id);
    res.send(doc.text);
}

exports.show_question = async(res, id, user)=>{
    let questions = await Question.findById(id).populate({
        path:'answers',
        populate:{
            path: 'comments',
            options: { sort: { cmt_date_time: -1 } }
        },
        options: { sort: { ans_date_time: -1 } }
    }).populate('comments').populate({
        path: 'comments',
        options: { sort: { cmt_date_time: -1 } }
    }).populate('tags').exec();

    questions.answers.sort((a, b) => {
        if (a.ans_by === user && b.ans_by !== user) return -1; 
        if (a.ans_by !== user && b.ans_by === user) return 1; 
        return 0; 
    });
    res.send(questions);
}

exports.update_answer = async(res, id, text)=>{
    let doc = await Answer.findByIdAndUpdate(id,{text:text});
    res.send('OK');
}

exports.delete_answer = async(res, id)=>{
    let answer = await Answer.findById(id).populate('comments').exec();
    let result = await Question.updateOne(
        { answers: id },
        { $pull: { answers: id } }
    );
    for(const cmt of answer.comments){
        await Comment.deleteOne({_id: cmt._id});
    }
    await Answer.deleteOne({_id: id});
    res.send('OK');
}