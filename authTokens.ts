import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '20s',
  });
};
export const createRefreshToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '30s',
  });
};
