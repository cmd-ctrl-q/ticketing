import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';

const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  // sends back header that tells user's browser to dump everything in the cookie
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
