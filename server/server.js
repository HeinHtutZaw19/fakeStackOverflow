const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/users');

const db_addr = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(db_addr, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connections;
db.concat('error', console.error.bind(console,"MongoDB connection error:"));

const app = express();
const port = 8000;
const day = 24 * 60 * 60 * 1000; 


app.use(cors({   origin: true,   credentials: true, }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'my secret key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: 'mongodb://127.0.0.1:27017/fake_so', 
    ttl: 600
  }),
  user: {},
  cookie: { 
    secure: false,
    httpOnly: true, 
    sameSite: 'lax',
    maxAge: 600000 } // session last for 10 min
}));

app.use(function(req,res,next){
  console.log(req.session);
  console.log('======')
  console.log(req.session.views,req.session.ab );

  console.log('======')
  next();
})


function isAuthenticated(req, res, next) {
  if (req.session.user) {
      next();
  }
  else {
      next('route');
  }
}

app.get('/', isAuthenticated,  (req, res) => {
  UserInfo.show_user(res,req.session.user)
});

app.get('/', (req, res) => {
  res.send('Session Not Found')
});

const saltRounds = 10

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


app.post('/register', async (req, res) => {
    const duplicate = (await User.find({email: req.body.email}).exec())[0];
    if(duplicate){
        res.send("DUPLICATE");
        return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const pwHash = await bcrypt.hash(req.body.pw, salt);
    const newUser = new User({username: req.body.username, email: req.body.email, passwordHash: pwHash});
    const savedUser = await newUser.save();
    res.send("OK");
});


app.post('/login', async (req, res) => {
  const email = req.body.email;
    const pw = req.body.pw;
    const user = (await User.findOne({email: email}).exec());
    if(!user){
      res.send("Wrong Mail")
      return
    }
    const verdict = await bcrypt.compare(pw, user.passwordHash);
    
    if(!verdict) {
        res.send("Wrong Password")
        return
      }
    if (verdict) {

      req.session.user = email.trim();
      req.session.regenerate(function(err) {
        if (err) {
            next(err);
        }
    
        req.session.user = email.trim();
    
        req.session.save(function (err) {
            if (err) {
                return next(err);
            }
          });
        });
        res.send({createdAt:user.createdAt, reputation:user.reputation, isAdmin: user.isAdmin})
    }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  });
});


let Questions = require('./pages/questions_page');
let Profile = require('./pages/profilepage')
let CreateQuestion = require('./pages/newquestion');
let QuestionInfo = require('./pages/questioninfo');
let TagInfo = require('./pages/tags')
let CreateAnswer = require('./pages/newanswer');
let Search = require('./pages/search');
let UpdateVote = require('./pages/updatevote')
let CreateComment = require('./pages/newcomment')
let AnswerInfo = require('./pages/answerinfo')
let UserInfo = require('./pages/userinfo')

app.get('/users/:user', (req, res)=>{
  UserInfo.show_users(res, req.params.user)
})
app.get('/question/:type', (req, res) => {
  const type = req.params.type;
  if (type === 'newest' || type === 'active' || type === 'unanswered') {
    Questions.show_questions(res, type);
  } else {
    res.status(404).send('Not Found');
  }
});


app.get('/answer/:id', (req, res) => {
  AnswerInfo.show_answer(res,req.params.id)
})

app.get('/question/answer/:id/:user', (req, res) => {
  AnswerInfo.show_question(res,req.params.id,req.params.user);
})

app.post('/create/question', (req, res) => {
  CreateQuestion.insert(res,
      req.body.tags.split('.'),
      req.body.title,
      req.body.text,
      req.body.summary,
      req.body.asked_by).catch(err=>{
        console.error('Failed to create new question' + err)
      });
})

app.get('/create/question/:id/:incr', (req, res) => {
  QuestionInfo.show_question(res,req.params.id, req.params.incr);
})

app.post('/create/answer', (req, res)=>{
  CreateAnswer.insert(res,req.body.id,req.body.text,req.body.ans_by);
})

app.post('/search/tags/', (req,res)=>{
  Search.search_by_tags(res,req.body.tags);
})

app.post('/search/words/', (req,res)=>{
  Search.search_by_words(res,req.body.words);
})

app.get('/tags',(req,res)=>{
  TagInfo.show_tags(res)
})

app.get('/users',async(req,res)=>{
  let users = await User.find();
  let mappedUsers = users.map(u => ({
    id: u._id,
    email: u.email,
    reputation: u.reputation,
    isAdmin: u.isAdmin,
    createdAt: u.createdAt,
  }));
  res.send(mappedUsers);
})

app.get('/find/user/:user', async(req,res)=>{
  UserInfo.show_user(res, req.params.user);
})
app.get('/find/:user', async (req,res)=>{
  user = await User.findOne({email: req.params.user})
  if(user){
    res.send('OK');
  }
  else{
    res.send('Not Found')
  }
})
app.get('/find/:user/:mode', async(req,res)=>{
  Profile.find(res,req.params.user,req.params.mode);
})

app.get('/:mode/vote/:id/:vote', async(req,res)=>{
  UpdateVote.update(res, req.params.mode, req.params.id, req.params.vote);
})

app.post('/create/comment', (req,res)=>{
  CreateComment.insert(res, req.body.mode, req.body.id, req.body.text, req.body.cmt_by);
})

app.get('/delete/tag/:tag', (req,res)=>{
  TagInfo.delete_tag(res, req.params.tag);
})

app.get('/delete/question/:question', (req,res)=>{
  QuestionInfo.delete_question(res, req.params.question);
})

app.get('/delete/answer/:answer', (req,res)=>{
  AnswerInfo.delete_answer(res, req.params.answer);
})

app.get('/delete/user/:user', (req,res)=>{
  UserInfo.delete_user(res, req.params.user);
})

app.post('/update/question',(req,res)=>{
  QuestionInfo.update_question(res,req.body.id,req.body.title,req.body.text,req.body.summary,req.body.tags)
})

app.post('/update/answer',(req,res)=>{
  AnswerInfo.update_answer(res,req.body.id,req.body.text);
})

app.post('/update/tag',(req,res)=>{
  TagInfo.update_tag(res,req.body.id,req.body.text.toLowerCase());
})


process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log('\nServer closed. Database instance disconnected');
    process.exit(0); 
  });
});

process.on('SIGTERM', () => {
  mongoose.connection.close().then(() => {
    console.log('\nServer closed. Database instance disconnected');
    process.exit(0); 
  });
});

  