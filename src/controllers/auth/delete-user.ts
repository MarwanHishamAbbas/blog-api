import { Request, Response } from 'express';

import { logger } from '@/lib/winston';

import User from '@/models/user';

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string;

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
    logger.error('Error while deleting user', error);
  }
};

export default deleteUserById;
