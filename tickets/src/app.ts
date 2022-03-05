import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@teds-tickets/common';

const app = express();
// trust traffic from ingress proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== 'test', // enforce https connection when not testing
  })
);

// routes

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// middleware
app.use(errorHandler);

export { app };
