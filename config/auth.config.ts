import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import Logger from './logger.config';

const authConfig = {
  domain: 'dev-ohvjdegt.eu.auth0.com',
  audience: 'https://booksy-api.herokuapp.com/',
};

const jwtHandler = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
});

const jwtErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    Logger.error(err);
    return;
  }
  next();
};

const jwtIgnore = (err, req, res, next) => {
  next();
};

export const checkJwtOrIgnore = [jwtHandler, jwtIgnore];
export const checkJwt = [jwtHandler, jwtErrorHandler];
