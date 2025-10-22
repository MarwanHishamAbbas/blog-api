import { Request, Response } from 'express';

import { logger } from '@/lib/winston';

import User from '@/models/user';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  try {
    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while deleting current user', error);
  }
};

export default deleteCurrentUser;
