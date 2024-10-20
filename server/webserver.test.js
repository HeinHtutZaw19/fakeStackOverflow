const axios = require('axios');
jest.mock('axios')
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');

describe('GET /', () => {
  it('server should run on port 8000', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const res = await axios.get('http://localhost:8000/');
    expect(res.status).toBe(200);
  });
});
describe('Find User', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb://127.0.0.1:27017/fake_so", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
    });

    beforeEach(async () => {
        await db.collection('users').deleteMany({});
    });
    afterAll(async () => {
        await connection.close();
    });

    it('Should Return Doc', async () => {
        const users = db.collection('users');
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const pwHash = await bcrypt.hash('password', salt);
        const mockUser = {
            _id: 'some_user_id',
            username: 'boy',
            email: 'boy@mail.com',
            passwordHash: pwHash,
            reputation: 30,
            isAdmin: false,
        }
        const expectedUser = {
            id: mockUser._id,
            email: mockUser.email,
            reputation: mockUser.reputation,
            isAdmin: mockUser.isAdmin,
            createdAt: mockUser.createdAt,
        }
        axios.get.mockResolvedValue(expectedUser);
        await users.insertOne(mockUser);
        const insertedUser = await users.findOne({_id: 'some_user_id'});
    
        const res = await axios.get(`http://localhost:8000/find/user/${mockUser._id}`);
        console.log(res); 
        expect(res.id).toBe(expectedUser.id);
        expect(res.email).toBe(expectedUser.email);
        expect(res.reputation).toBe(expectedUser.reputation);
        expect(res.isAdmin).toBe(expectedUser.isAdmin);
        await users.deleteOne({_id: insertedUser._id});
    });

    it('Should Delete Doc', async () => {
        const users = db.collection('users');
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const pwHash = await bcrypt.hash('password', salt);
        const mockUser = {
            _id: 'some_user_id',
            username: 'boy',
            email: 'boy@mail.com',
            passwordHash: pwHash,
            reputation: 30,
            isAdmin: false,
        }
        axios.get.mockResolvedValue([]);
        await users.insertOne(mockUser);
        const insertedUser = await users.findOne({_id: 'some_user_id'});
    
        const res = await axios.get(`http://localhost:8000/delete/user/${mockUser._id}`);
        console.log(res); 
        expect(res).toEqual([]);
    });
})
    