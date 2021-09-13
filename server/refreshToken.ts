import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { createRefreshToken, createAccessToken } from './authTokens';

const prisma = new PrismaClient();

export default async function refreshToken(req: Request, res: Response) {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (error) {
    console.log(error);
    return res.send({ ok: false, accessToken: '' });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.token_version !== payload.tokenVersion) {
    console.log('invalid token version');
    return res.send({ ok: false, accessToken: '' });
  }

  res.cookie('jid', createRefreshToken(user), { httpOnly: true });
  return res.send({ ok: true, accessToken: createAccessToken(user) });
}
