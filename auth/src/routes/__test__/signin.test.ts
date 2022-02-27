import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  // try to sign into an account that doesn't exist
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  // create a new account
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // try and sign into existing account but with an invalid password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'invalid-pass',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  // create a new account
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // try and sign into existing account but with an invalid password
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  // verify cookie header is defined
  expect(response.get('Set-Cookie')).toBeDefined();
});
