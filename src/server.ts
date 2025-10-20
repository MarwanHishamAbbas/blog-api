/*  Node Modules */
import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/*  Custom Modules */
import config from '@/config';
import limiter from '@/lib/express-rate-limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

import v1Routers from '@/routes/v1';

const app = express();

app.use(express.json());

// Enable JSON Reqest Body Parsing
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Helemt enhance security by setting various HTTP headers
app.use(helmet());
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1KB
  }),
);

// Apply Rate Limiting middleware
app.use(limiter);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.info(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply Cors Middleware
app.use(cors(corsOptions));

// Configure Cors Options

// Immediatly Invoked Async Fuction Expression (IIFE) to start the server

(async () => {
  try {
    await connectToDatabase();
    app.use('/api/v1', v1Routers);
    app.listen(config.PORT, () => {
      logger.info(`Server Running on Port http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.info('Failed to start the server', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/* 

- Handles server shutdown gracefully by disconnecting from the database.
- Attempts to disconnect from the database before shutting down the server.
- Logs a success message if the disconnection is successful.
- If an error occurs during disconnection, it is logged to the console

Exits the process with status code 0 (indicating a successful shutdown)

*/

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    logger.info('Error During Shutdown', error);
  }
};

/* 

* Listens for termination signals (`SIGTERM` and `SIGINT`).

- `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown)
- `SIGINT` is triggered when the user interrupts the process (e.g., pressing ` Ctrl + C`)
- When either signal is received, `handleServerShutdown` is executed to ensure proper cleanup
*/

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
