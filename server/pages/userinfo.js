
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let Question = require('../models/questions');
let User = require('../models/users');
let QuestionInfo = require('./questioninfo')

exports.show_users = async(res, name) => {
    let docs = await User.find({email: {$ne: name}}).exec();
    let mappedUsers = docs.map(u => ({
        id: u._id,
        email: u.email,
        reputation: u.reputation,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt,
      }));
      res.send(mappedUsers);
}

exports.show_user = async(res,name) =>{
    let user = await User.findOne({email: name}).exec();
    res.send({
        id: user._id,
        email: user.email,
        reputation: user.reputation,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
}


exports.delete_user = async(res, name)=>{
    let questions = await Question.find({asked_by:name}).exec();
    questions.map(q=>QuestionInfo.delete_question(res,q._id,1))
    await User.deleteOne({email:name});
    this.show_users(res, name)
}