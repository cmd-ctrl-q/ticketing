import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    // check potential errors
    if (!errors.isEmpty()) {
      // handle errors
      // return res.status(400).send(errors.array());
      // express will capture any error thrown, and
      // sends it to the error-handler middleware to be processed.
      // throw new Error('Invalid email or password');
      throw new RequestValidationError(errors.array());
    }

    console.log('Creating a user...');
    // throw new Error('Error connecting to database.');
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
