import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    // reject the request
    throw new NotAuthorizedError();
  }

  // user is signed in, continue to next middleware
  next();
};
