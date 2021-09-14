import { Response } from 'express';

export const sendRefreshCookie = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token',
    maxAge: 6.048e8,
  });
};
