import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, OrderStatus } from '@teds-tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // get all of the orders associated with the user
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );
  if (orders.length === 0) {
    throw new NotFoundError();
  }

  res.status(200).send(orders);
});

export { router as indexOrderRouter };
