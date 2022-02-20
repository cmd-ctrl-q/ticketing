import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test100@test.com',
      password: 'myPassword',
    })
    .expect(201);
});
