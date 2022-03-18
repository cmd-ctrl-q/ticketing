import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('updates an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  const user = global.signin();

  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // get updated order
  const updatedOrder = await Order.findById(order.id);

  // expect that order is cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: '123',
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  const user = global.signin();

  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
