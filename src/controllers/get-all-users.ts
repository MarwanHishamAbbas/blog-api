import { Request, Response } from 'express';

import config from '@/config';
import { logger } from '@/lib/winston';

import User from '@/models/user';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit =
      parseInt(req.query.limit as string) || config.DEFAULT_RES_LIMIT;
    const offset =
      parseInt(req.query.offset as string) || config.DEFAULT_RES_OFFSET;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while getting current user', error);
  }
};

export default getAllUsers;
