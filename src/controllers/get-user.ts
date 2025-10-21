import { Request, Response } from 'express';

import { logger } from '@/lib/winston';

import User from '@/models/user';

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    const user = await User.findById(userId).select('-__v').exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while getting user', error);
  }
};

export default getUserById;
