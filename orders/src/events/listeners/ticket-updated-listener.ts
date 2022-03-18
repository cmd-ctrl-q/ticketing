import { Message } from 'node-nats-streaming';
import {
  Listener,
  TicketCreatedEvent,
  Subjects,
  TicketUpdatedEvent,
} from '@teds-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    // find the ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // update the ticket
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
