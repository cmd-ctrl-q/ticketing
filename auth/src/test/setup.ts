import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

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
  await mongoose.connection.close();
});
