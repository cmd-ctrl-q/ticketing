import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post rquests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  // empty title value
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '', // invalid
      price: 10,
    })
    .expect(400);

  // empty title field
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  // empty price value
  // empty title field
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'random-title',
      price: -10, // invalid
    })
    .expect(400);

  // empty price field
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'random-title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  // TODO: check if ticket was saved to db
  // Check how many records are in db before saving the new record
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'my-title';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  // Check how many records are in db after saving the new record
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
