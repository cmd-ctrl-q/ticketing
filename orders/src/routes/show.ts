import express, { Request, Response } from 'express';
import { NotFoundError } from '@teds-tickets/common';
// import { Order } from '../models/order';

const router = express.Router();

router.get('/api/tickets/:orderId', async (req: Request, res: Response) => {
  res.send({ msg: 'show orders route' });
});

export { router as showOrderRouter };
