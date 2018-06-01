import { Response, Request } from "express";
import { NextFunction } from "express-serve-static-core";
import * as config from '../config/db.config';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';

export const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://itworks.au.auth0.com/.well-known/jwks.json'
  }),
  // audience: 'https://itworks.au.auth0.com/userinfo',
  audience: 'http://itworks.gslc.local',
  issuer: 'itworks.au.auth0.com',
  algorithms: ['RS256']
});

export function tokenCheck(req: Request, res: Response, next: NextFunction) {
  // TODO: finish this
  next();
}


