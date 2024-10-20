let Question = require('../models/questions');
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let User = require('../models/users');

exports.find = async (res, user, mode) => {
    var questions
    if(mode==='question'){
        questions = await Question.find({asked_by:user}).sort({ ask_date_time: -1 }).populate('tags').exec();
        res.send(questions);
        return;
    }
    else if(mode==='answer') {
        let ans = await Answer.find({ ans_by:user });
        let ansIds = ans.map(answer => answer._id);
        
        let questions = await Question.find({ answers: { $in: ansIds } })
            .populate('tags')
            .sort({ ask_date_time: -1 })
            .exec();
        res.send(questions)
        return;
        
    }
    else if(mode==='tag'){
        questions = await Question.find({ asked_by:user }).populate('tags').exec();
        let ans = await Answer.find({ ans_by:user });
        let ansIds = ans.map(answer => answer._id);
        let q2 = await Question.find({ answers: { $in: ansIds } }).populate('tags').exec();
        questions=questions.concat(q2)
        let tags = questions.flatMap(q=>q.tags);
        tags = [...new Set(tags)];
        res.send(tags);
    }
}