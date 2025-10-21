import { Request, Response } from 'express';

import { logger } from '@/lib/winston';

import User from '@/models/user';

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  const { username, email, first_name, last_name } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;

    await user.save();
    logger.info('User updated successfully', user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while updating current user', error);
  }
};

export default updateCurrentUser;
