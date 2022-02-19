import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    // simply modifies the Request interface to add a new property.
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // is user logged in?
  if (!req.session?.jwt) {
    return next();
  }

  try {
    //  verify jwt
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // add user data to the new request property 'currentUser' so other middlewares and handlers can easily extract the user's data
    req.currentUser = payload;
  } catch (err) {}

  next();
};
