import express, { Request, Response } from 'express';
import 'dotenv/config';
import AuthRouter from './auth/router';
import BlockchainRouter from './blockchain/router';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import verifyJWTTokenMiddleware from './middlewares/token';
import passport from 'passport';
import session from 'express-session';
import { validateEnv } from './config/env';
require('./auth/authenticate');

if (!validateEnv()) {
  process.exit();
}

const app = express();

app.use(
  session({ secret: 'vaibhav', resave: false, saveUninitialized: false }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(verifyJWTTokenMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/auth', AuthRouter);
app.use('/blockchain', BlockchainRouter);

export default app;
