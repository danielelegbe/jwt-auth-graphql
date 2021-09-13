import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface MyContext {
  req: Request;
  res: Response;
  payload?: Payload;
  prisma: PrismaClient;
}

interface Payload {
  userId: string;
  tokenVersion?: number;
}
