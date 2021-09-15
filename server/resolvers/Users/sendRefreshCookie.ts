import { Response } from 'express';

export const sendRefreshCookie = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 6.048e8,
    path: '/',
  });
};
