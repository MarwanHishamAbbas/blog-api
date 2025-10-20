import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Authorization header. If the token is valid, the user's ID is attached to the request object. Otherwide, it return an error response.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @param {NextFunction} next - Express next function.
 *
 * @returns {void}
 *
 **/

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }
  const [_, token] = authHeader.split(' ');

  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    req.userId = jwtPayload.userId;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error during authentication');
  }
};

export default authenticate;
