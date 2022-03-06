import request from 'supertest';
import { app } from '../../app';
import { createMongoID } from './utils';

it('returns a 404 if the ticket is not found', async () => {
  const id = createMongoID();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  // create ticket record in db
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  // get the newly created ticket record
  const ticketResp = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  // inspect response
  expect(ticketResp.body.title).toEqual(title);
  expect(ticketResp.body.price).toEqual(price);
});
