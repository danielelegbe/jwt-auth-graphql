import { User } from './prisma/generated/type-graphql/index';
import jwt from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};
export const createRefreshToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.token_version },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};
