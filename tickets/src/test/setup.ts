import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import { createMongoID } from '../routes/__test__/utils';

declare global {
  var signin: () => string[];
}

// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

let mongo: any;

// runs before all tests are executed
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  // connect to in memory server
  await mongoose.connect(mongoUri);
});

// with mock, jest will redirect the from the real nats-wrapper.ts to the fake nats-wrapper.ts
jest.mock('../nats-wrapper.ts');

// runs before each test
beforeEach(async () => {
  jest.clearAllMocks();

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

global.signin = () => {
  const id = createMongoID();
  // Build a JWT payload: { id, email }
  const payload = {
    id,
    email: 'test@test.com',
  };

  // Create the JWT.
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: JWT }
  const session = { jwt: token };

  // Turn object into JSON
  const jason = JSON.stringify(session);

  // Encode JSON to base64
  const base64 = Buffer.from(jason).toString('base64');

  // return the cookie with the encoded data
  // return [`express:sess=${base64}`];
  return [`session=${base64}`];
};
