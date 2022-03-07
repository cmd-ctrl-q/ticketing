import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@teds-tickets/common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // get ticket id
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure the current user owns the ticket
    if (req.currentUser!.id !== ticket.userId) {
      // unauthorized user trying to update another users ticket
      throw new NotAuthorizedError();
    }

    // update the new ticket
    const newTicket = {
      title: ticket.title,
      price: ticket.price,
    };

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
