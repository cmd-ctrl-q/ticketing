import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;

// runs before all tests are executed
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  // connect to in memory server
  await mongoose.connect(mongoUri);
});

// runs before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  // loop through data and delete before each run
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// runs after all tests are complete
afterAll(async () => {
  await mongo.stop();
  mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
