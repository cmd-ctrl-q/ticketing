import express, { Request, Response } from 'express';
// import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', (req: Request, res: Response) => {
  res.send({ msg: 'delete orders route' });
});

export { router as deleteOrderRouter };
