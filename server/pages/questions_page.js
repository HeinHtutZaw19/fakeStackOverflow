let Question = require('../models/questions');
let Tag = require('../models/tags');
let Answer = require('../models/answers');

exports.show_questions = async (res, mode) => {
  var questions
  if(mode==='newest'){
    questions = await Question.find().sort({ ask_date_time: -1 }).populate('tags').populate('answers').exec();
  }
  else if(mode==='active'){
    questions = await Question.find().populate('tags').populate('answers').exec();
    questions = questions.sort((a,b)=>{
      const lastAnsDateA = a.answers.length > 0 ? a.answers[a.answers.length - 1].ans_date_time : new Date('1970-01-01T00:00:00.000Z');
      const lastAnsDateB = b.answers.length > 0 ? b.answers[b.answers.length - 1].ans_date_time : new Date('1970-01-01T00:00:00.000Z');
      return lastAnsDateB - lastAnsDateA;
    });
  }
  else{
    questions = await Question.find({ answers: [] }).populate('tags').exec();
  }

  res.send(questions);
}
