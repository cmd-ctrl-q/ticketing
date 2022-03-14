import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  OrderStatus,
  NotFoundError,
  BadRequestError,
} from '@teds-tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

// Options: extract from env var. extract from db. or make it user specific.
const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // check that id is a valid mongo id; (assumes always using mongo db)
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // get ticket from request body
    const { ticketId } = req.body;

    // find ticket user is trying to purchase
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure ticket isn't already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // calculate an expiration date for the new order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // TODO: publish an event to other services that an order was created

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
