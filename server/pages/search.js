let Question = require('../models/questions');
let Tag = require('../models/tags');
const ObjectId = require('mongoose').Types.ObjectId;

exports.search_by_tags = async (res, tags) => {
    let questions = []
    for(let tag of tags){
        try{
            let foundTag = await Tag.findOne({ name: { $regex: new RegExp(`\\b${tag}\\b`, 'i') } });
            if(foundTag){
                let q = await Question.find({tags: {$in: [new ObjectId(foundTag._id)]}}).populate('tags').populate('answers').exec();
                questions = questions.concat(q);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    res.send(questions);
}

exports.search_by_words = async (res, words) => {
    let questions = []
    for (let word of words) {
        let q = await Question.find({
            $or: [
                { title: { $regex: new RegExp(`\\b${word}\\b`, 'i') } },
                { text: { $regex: new RegExp(`\\b${word}\\b`, 'i') } }
            ]
        }).populate('tags').populate('answers').exec();
        if (q.length > 0) {
            questions = questions.concat(q)
        }
    }
    res.send(questions);
}