import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import User from '@/models/user';
import Token from '@/models/token';
import config from '@/config';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    // Generate access token and refresh token for user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    await Token.create({ token: refreshToken, userId: user._id });

    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User logged in  successfully', {
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 'ServerError', message: 'Internal server error', error });
    logger.error('Error logging the user in', error);
  }
};

export default login;
