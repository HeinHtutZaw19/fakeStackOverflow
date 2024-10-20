let Question = require('../models/questions');
let Comment = require('../models/comments');
let Answer = require('../models/answers');
let User = require('../models/users');

exports.insert = async (res, mode, id, text, cmt_by) => {
    const comment = await Comment.create({text: text, cmt_by: cmt_by, cmt_date_time: Date.now(), votes: 0})
    if(mode==='question'){
        await Question.findByIdAndUpdate(id,{ $push: { comments: comment._id } });
        const doc = await Question.findById(id).populate({
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
        
        res.send(doc);
    }
    else if(mode==='answer'){
        const answer = await Answer.findByIdAndUpdate(id,{ $push: { comments: comment._id } });
        const q = await Question.findOne({ answers: { $in: [answer._id] } }).populate({
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
        res.send(q);
    }
    
}