import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: '123',
  });

  // Save ticket to db
  await ticket.save();

  // Fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes of the fetched tickets
  firstInstance!.set({ price: 101 });
  secondInstance!.set({ price: 102 });

  // Save the first fetched ticket (version: 1)
  await firstInstance!.save();

  // Save the second fetched ticket (outdated version ) and expect error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point.');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
