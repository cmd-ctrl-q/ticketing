import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@teds-tickets/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // get order
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    // check if user asking to change the order also owns the order
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // change status to cancel
    order.status = OrderStatus.Cancelled;

    // save changes
    await order.save();

    // publish event that order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    res.status(204).send(order);
  }
);

export { router as cancelOrderRouter };
