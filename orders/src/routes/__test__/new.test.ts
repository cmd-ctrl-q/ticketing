import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders/ticketId for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticketId is provided', async () => {
  const ticketId = ''; // invalid ticketId
  await request(app)
    .post(`/api/orders/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(400);
});

it('returns an error if an invalid ticketId is provided', async () => {
  const ticketId = 'asdf'; // invalid ticketId
  await request(app)
    .post(`/api/orders`)
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(400);
});

it('returns an error if no ticketId is provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send()
    .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // create a new ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 1000,
  });
  // save the ticket
  await ticket.save();

  // create a new order
  const order = Order.build({
    ticket,
    userId: 'asdfasdf',
    status: OrderStatus.Created,
    expiresAt: new Date(), // instantly expires
  });
  // save the order
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

// success
it('reserves a ticket', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });
  // save the ticket
  await ticket.save();

  // create a new order with linked to the ticket above
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });
  // save the ticket
  await ticket.save();

  // create a new order with linked to the ticket above
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
