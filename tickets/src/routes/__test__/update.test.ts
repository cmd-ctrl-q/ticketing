import request from 'supertest';
import { app } from '../../app';
import { createMongoID } from './utils';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets/:id for put requests', async () => {
  const response = await request(app).put(`/api/tickets/k48fhsb4295`).send({});

  expect(response.status).not.toEqual(404);
});

it('returns a 404 if the provided id doesn not exist', async () => {
  const id = createMongoID();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = createMongoID();

  await request(app)
    .put(`/api/tickets/${id}`)
    // .set('Cookie', global.signin()) // mimics not signed in
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own a ticket', async () => {
  const user1 = global.signin();
  const user2 = global.signin();

  // create a new ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', user1)
    .send({ title: 'asdf', price: 20 })
    .expect(201);

  // update the same ticket but with a different user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', user2)
    .send({
      title: 'updated title',
      price: 22,
    })
    .expect(401);

  // TODO: do follow up request to verify the ticket was updated
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  // create a new ticket
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: 20,
    });

  // update ticket with empty title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);

  // update ticket with no title field
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 20,
    })
    .expect(400);

  // update ticket with invalid price field value
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: -100, // negative value
    })
    .expect(400);

  // update ticket with no price field
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  // Fetch updated ticket and validate it was updated with new data
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('updates the ticket provided valid inputs', async () => {});
