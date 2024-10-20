let Question = require('../models/questions');
let Tag = require('../models/tags');

exports.show_tags = async(res)=>{
    let tags = await Tag.find();
    res.send(tags);
}

exports.delete_tag= async(res, id)=>{
   
    let result = await Question.updateMany(
        { tags: id },
        { $pull: { tags: id } }
    );
    await Tag.deleteOne({_id: id});
    // let question = await Question.find({tags:id});
    // if(question._doc.tags.length==0){

    // }
    res.send('OK');
    
}

exports.update_tag = async(res, id, text)=>{
    let duplicate = await Tag.findOne({name: text});
    if(duplicate){
        let result = await Question.updateMany(
            { tags: { $all: [id, duplicate._id] } },
            { $pull: { tags: id } }
        );
        result = await Question.updateMany(
            { tags: id },
            { $set: { "tags.$": duplicate._id } }
        );
        await Tag.deleteOne({_id: id});
    }
    else{
        let result = await Tag.updateOne({_id:id}, {name:text});
        console.log(result);
    }
    res.send('OK')
}