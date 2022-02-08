import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.all('*', async (req, res, next) => {
app.all('*', async (req, res) => {
  // express will capture error and send it off to the middleware,
  // which will take the status code and call the serialize function,
  // then generate a response and send it back to client.
  // throw new NotFoundError(); // only for synchronous (without express-async-errors package)
  // next(new NotFoundError()); // for asynchronous (without express-async-errors package)
  throw new NotFoundError(); // express-async-errors allows upgrades it to asynchronous
});

// middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});
