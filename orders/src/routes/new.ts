import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (req: Request, res: Response) => {
  res.send({ msg: 'new orders route' });
});

export { router as createOrderRouter };
