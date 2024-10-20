const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users.js');
const Tag = require('./models/tags.js');
const Comment = require('./models/comments.js');
const Question = require('./models/questions.js');
const Answer = require('./models/answers.js');

const db_addr = 'mongodb://127.0.0.1:27017/fake_so';

async function init(adminUser, adminPassword) {
    try {
        await mongoose.connect(db_addr, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const pwHash = await bcrypt.hash(adminPassword, salt);

        const admin = await User.create({
            username: adminUser.split('@')[0],
            email: adminUser,
            passwordHash: pwHash,
            isAdmin: true,
            reputation: 1000,
        });

        const javascriptTag = await Tag.create({name:'javascript'})
        const htmlTag = await Tag.create({name:'html'})
        const cssTag = await Tag.create({name:'css'})
        const expressTag = await Tag.create({ name: 'express' });
        const reactTag = await Tag.create({ name: 'react' });
        const nodeTag = await Tag.create({ name: 'node' });
        const mongoTag = await Tag.create({ name: 'mongodb' });
    
        let users=[]
        let reputations=[49,50,100]
        for(let i = 0;i<3;i++){
            const salt = await bcrypt.genSalt(saltRounds);
            const pwHash = await bcrypt.hash('u'+i, salt);
            const user = await User.create({
                username: 'user'+i,
                email: 'user'+i+'@gmail.com',
                passwordHash: pwHash,
                reputation: reputations[i]
            });
            users.push(user)
        }
        let ans_comments=[]
        let quest_comments=[]
        for(let i = 0;i<10;i++){
            let num = i%3;
            let cmt = await Comment.create({
                text: 'Ans_Comment_'+i,
                cmt_by:  users[num].email
            })
            ans_comments.push(cmt);
            
            cmt = await Comment.create({
                text: 'Question_Comment_'+i,
                cmt_by: users[num].email
            })
            quest_comments.push(cmt);
        }
    
        /*Q1*/
        const answer=await Answer.create({
            text:'Answer1',
            ans_by: users[0].email,
            comments: ans_comments.slice(0, 3),
        })
        const answer2 = await Answer.create({
            text:'Answer2',
            ans_by: users[2].email,
            comments: [],
        })
        const q = await Question.create({
            title: 'Question1',
            text: 'QuestionText1',
            summary:  'QuestionSummary1',
            tags: [javascriptTag._id,htmlTag._id],
            answers: [answer, answer2],
            comments: quest_comments.slice(0,2),
            asked_by: users[1].email
        })
    
        /*Q2*/
        const answerQ2_1 = await Answer.create({
            text: 'Answer to question 2',
            ans_by: users[2].email,
            comments: ans_comments.slice(3,4),
        });
        const answerQ2_2 = await Answer.create({
            text: 'Another answer to question 2',
            ans_by: users[0].email,
            comments: []
        });
        const q2 = await Question.create({
            title: 'Question 2 Title',
            text: 'Question 2 Text',
            summary: 'Question 2 Summary',
            tags: [expressTag._id, htmlTag._id, nodeTag._id],
            answers: [answerQ2_1._id, answerQ2_2._id],
            comments: quest_comments.slice(2,10),
            asked_by: users[1].email
        });
    
        /*Q3*/
        const answerQ3_1 = await Answer.create({
            text: 'Answer to question 3',
            ans_by: users[1].email,
            comments: ans_comments.slice(4,10),
        });
        const answerQ3_2 = await Answer.create({
            text: 'Another answer to question 3',
            ans_by: users[2].email,
            comments: []
        });
        const q3 = await Question.create({
            title: 'Question 3 Title',
            text: 'Question 3 Text',
            summary: 'Question 3 Summary',
            tags: [cssTag._id, javascriptTag._id, reactTag._id,mongoTag._id],
            answers: [answerQ3_1, answerQ3_2],
            comments: [],
            asked_by: users[0].email
        });

        console.log('Initialization complete');
        process.exit(0); 
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1); 
    }
}

if (process.argv.length < 4) {
    console.error('Usage: node setup.js <adminUser> <adminPassword>');
    process.exit(1);
}

init(process.argv[2], process.argv[3]);
