import express, { Request, Response } from 'express';
// import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  res.send({ msg: 'index orders route' });
});

export { router as indexOrderRouter };
