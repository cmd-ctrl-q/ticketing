import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('has a route handler listening to /api/orders for get requests', async () => {
  const response = await request(app).get('/api/orders');

  expect(response.status).not.toEqual(404);
});

it('returns a status of 401 if the user is not signed in', async () => {
  const response = await request(app).get('/api/orders');

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).get('/').set('Cookie', global.signin());

  expect(response.status).not.toEqual(401);
});

it('fetches orders for a particular user', async () => {
  // create two users
  const user1 = global.signin();
  const user2 = global.signin();

  // create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  // create one order as user1
  // use the route handler to create the order so you dont have to do an unnecessary get request for the ticket id.
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // create two orders for user2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // make request to get orders created by user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // expect to get only the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(order1.ticket.id);
  expect(response.body[1].ticket.id).toEqual(order2.ticket.id);
});
