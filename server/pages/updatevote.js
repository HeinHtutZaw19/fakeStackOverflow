let Question = require('../models/questions');
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let User = require('../models/users');

exports.update = async (res, mode, id, vote) => {
    var question = null;
    if(mode==='question'){
        question = await Question.findById(id).exec();
        let opt = question.votes>vote?'downvote':'upvote';
        question = await Question.findByIdAndUpdate(id, { votes: vote }).exec();
        if(opt==='upvote'){
             await User.findOneAndUpdate(
                { email: question.asked_by },
                { $inc: { reputation: 5 } }
            ).exec();
        }
        else{
            await User.findOneAndUpdate(
                { email: question.asked_by },
                { $inc: { reputation: -10 } }
            ).exec();
        }
        question = await Question.findById(id).populate('comments').populate({
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
        
    }
    else if(mode==='answer'){
        const answer = await Answer.findById(id).exec();
        let opt = answer.votes>vote?'downvote':'upvote';
        await Answer.findByIdAndUpdate(id, {votes: vote});
        if(answer){
            if(opt==='upvote'){
                await User.findOneAndUpdate(
                   { email: answer.ans_by },
                   { $inc: { reputation: 5 } }
               ).exec();
           }
           else{
               await User.findOneAndUpdate(
                   { email: answer.ans_by },
                   { $inc: { reputation: -10 } }
               ).exec();
           }
            question = await Question.findOne({ answers: { $in: [id] } }).populate({
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
            
        }
    }
    else if(mode==='qcomment'){
        const cmt = await Comment.findByIdAndUpdate(id, {votes: vote});
        if(cmt){
            question = await Question.findOne({ comments: {$in: [id]} }).populate({
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
        }
    }
    else{
        const cmt = await Comment.findByIdAndUpdate(id, {votes: vote});
        if(cmt){
            const ans = await Answer.findOne({ comments: {$in: [id]} })
            question = await Question.findOne({answers: {$in: [ans._id]}}).populate({
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
        }
    }
    if(question){
        res.send(question)
    }
    else{
        res.send('Not Found')
    }
}
