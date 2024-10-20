const {MongoClient} = require('mongodb');

const bcrypt = require('bcrypt');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://127.0.0.1:27017/fake_so", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection and increase the count by 1', async () => {
    const users = db.collection('users');
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const pwHash = await bcrypt.hash('password', salt);

    const mockUser = {
        _id: 'some_id',
        username: 'John',
        email: 'john@mail.com',
        passwordHash: pwHash,
        reputation: 30,
        isAdmin: false,
    }

    const usersCountBefore = await users.countDocuments();
    await users.insertOne(mockUser);
    const insertedUser = await users.findOne({_id: 'some_id'});
    const usersCountAfter = await users.countDocuments();
    expect(usersCountAfter).toEqual(usersCountBefore + 1);
    expect(insertedUser).toEqual(mockUser);
    await users.deleteOne({_id: insertedUser._id});
  });

  
  it('should delete a doc from collection and reduce the count by 1', async () => {
    const questions = db.collection('questions');
    const q={
        title: 'Dummy Question',
        text: 'text',
        summary: 'summary',
        tags: [],
        answers: [],
        comments: [],
        asked_by: 'henry@gmail.com'}
    const questionInsert = await questions.insertOne(q)
    const questionCountBefore = await questions.countDocuments();
    await questions.deleteOne({_id: questionInsert.insertedId});
    const questionCountAfter = await questions.countDocuments();
    expect(questionCountAfter).toEqual(questionCountBefore - 1);
  });

  it('should update a doc in the collection', async () => {
    const users = db.collection('users');
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const pwHash = await bcrypt.hash('password', salt);
    const mockUser = {
        _id: 'some_id',
        username: 'John',
        email: 'john@mail.com',
        passwordHash: pwHash,
        reputation: 30,
        isAdmin: false,
    }

    await users.insertOne(mockUser);
    
    const anotherUser = {
        ...mockUser,
        username: 'henry',
        email: 'henry@gmail.com',
        reputation: 100,
    };
    await users.updateOne({ _id: 'some_id' }, {$set:anotherUser });
    const user = await users.findOne({ _id: 'some_id' });
    expect(user).toEqual(anotherUser);
    await users.deleteOne({ _id: 'some_id' });
});



});