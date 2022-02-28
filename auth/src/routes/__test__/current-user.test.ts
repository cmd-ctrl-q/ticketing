import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // create new account
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // capture cookie from initial request
  const cookie = signupResponse.get('Set-Cookie');

  // make request to current-user endpoint
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) // include cookie to the request
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
