let Question = require('../models/questions');
let Tag = require('../models/tags');

exports.insert = async (res, tags, title, text, summary, asked_by) => {
    const tagElements = [];
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
            console.error("Error processing tag:", tag.toLowerCase(), error);
        }
    } 
    Question.create({
        title: title,
        text: text,
        summary: summary,
        tags: tagElements,
        answers: [],
        asked_by: asked_by,
    }).then(async()=>{
        let questions = await Question.find().sort({ ask_date_time: -1 }).populate('tags').populate('answers').exec();
        console.log('The questions are:', questions);
        res.send(questions);
    });

}