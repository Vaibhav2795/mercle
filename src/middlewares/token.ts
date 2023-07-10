import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { apiRoute } from '../utils/helper';
import { isTokenRevoked } from '../utils/dbHelper';
import { IJWTPayload } from '../types';
import { ENV } from '../config/env';

const PROTECTED_ROUTES: string[] = [
  apiRoute('/auth/me'),
  apiRoute('/auth/update-user'),
];

function verifyJWTToken(token: string) {
  const payload = jwt.verify(token, ENV.JWT_SECRET_KEY);
  return payload;
}

function validateCaller(email: string, jwtPayload: IJWTPayload) {
  if (!jwtPayload) throw new Error('no jwtpayload, login required !');

  if (email.toLowerCase() != jwtPayload.user.email) {
    throw new Error('forbidden - spoofing');
  }

  return true;
}

export default async function verifyJWTTokenMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token;
    if (PROTECTED_ROUTES.includes(req.path)) {
      if (!token) throw new Error('Please Login');

      const isRevoked = await isTokenRevoked(token);
      if (isRevoked) throw new Error('Invalid token');

      const payload: any = verifyJWTToken(token);

      let email;
      if (req.body) {
        email = req.body.email;
      }
      if (req.user) {
        email = req.user.email;
        req.body.email = email;
      }
      validateCaller(email, payload);

      req.body.jwtPayload = payload;
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: { service: 'Marcel-API', message: err.message } });
  }
}
