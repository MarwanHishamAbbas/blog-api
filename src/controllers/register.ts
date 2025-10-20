import { logger } from '@/lib/winston';
import config from '@/config';
import type { Request, Response } from 'express';

import User, { type IUser } from '@/models/user';
import { genUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import Token from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access token and refresh token for new user

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in DB

    await Token.create({ token: refreshToken, userId: newUser._id });

    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User Registered Successfully', {
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 'ServerError', message: 'Internal server error', error });
    logger.error('Error creating new user', error);
  }
};

export default register;
