import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
  prisma: PrismaClient;
}
