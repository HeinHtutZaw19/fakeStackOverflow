let Question = require('../models/questions');
let Tag = require('../models/tags');
let Answer = require('../models/answers');

let Comment = require('../models/comments');
let User = require('../models/users');

exports.show_question = async(res, id, incr) => {
    if(incr==='true'){
        await Question.findById(id).updateOne({$inc: {views:1}});
    }
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.update_question = async(res, id, title, text, summary, tags)=>{
    tags = tags.split('.');
    const tagElements = [];
    let question = await Question.findById(id);
    for (const tag of tags) {
        try {
            let existingTag = await Tag.findOne({ name: tag.toLowerCase() });
            if (existingTag) {
                tagElements.push(existingTag._id);
            } else {
                let newTag = await Tag.create({ name: tag.toLowerCase() });
                tagElements.push(newTag._id);
            }
        } catch (error) {
            console.error("Error processing tag:", tag, error);
        }
    }
    await Question.findById(id).updateOne({
        title: title,
        text: text,
        summary: summary,
        tags: tagElements
    });
    for(const tag of question.tags){
        let q = await Question.findOne({tags: tag}).exec();
        if(!q){
            let result = await Tag.deleteOne({_id: tag});
        }
    }
    res.send('OK');
}

exports.delete_question = async(res, id, opt=null)=>{
    let question = await Question.findById(id).populate('answers').populate({
        path:'answers',
        populate:{
            path: 'comments'
        }
    }).populate('comments').exec();

    for(const cmt of question.comments){
        await Comment.deleteOne({_id: cmt._id});
    }

    for(const ans of question.answers){
        for(const cmt of ans.comments){
            await Comment.deleteOne({_id: cmt._id});
        }
        await Answer.deleteOne({_id: ans._id});
    }

    await Question.deleteOne({_id: question._id});

    for(const tag of question.tags){
        let q = await Question.findOne({tags: tag}).exec();
        if(!q){
            let result = await Tag.deleteOne({_id: tag});
        }
    }
    await Question.deleteOne({_id:id});
    if(opt){
        return;
    }
    res.send('OK');
}