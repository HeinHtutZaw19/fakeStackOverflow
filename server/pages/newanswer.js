let Question = require('../models/questions');
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let User = require('../models/users');

exports.insert = async (res, id, text, ans_by) => {
    const answer = await Answer.create({text: text, ans_by: ans_by})
    Question.findByIdAndUpdate(id,{ $push: { answers: answer._id } }).then(async()=>{
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
        res.send(doc)
    })
    .catch(err=>{
        console.log(err)
    });
    
}