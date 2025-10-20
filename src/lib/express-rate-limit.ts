/* Node Modules */

import { rateLimit } from 'express-rate-limit';

// Configure rate limiting middleware

const limiter = rateLimit({
  windowMs: 60000, // 1-minute time window for request limiting
  limit: 60, // allow max of 60 request per window IP
  standardHeaders: 'draft-8', // Use the latest standard rate-limit headers
  legacyHeaders: false,
  message: {
    error:
      'You have sent too many request in a given amount of time. Please try again later',
  },
});

export default limiter;
