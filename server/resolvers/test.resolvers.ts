import 'reflect-metadata';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../Context';
import { isAuth } from '../isAuth';
import { User } from '../prisma/generated/type-graphql';
import jwt from 'jsonwebtoken';

@Resolver()
export class TestResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `user id is ${payload!.userId}`;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      return context.prisma.user.findUnique({ where: { id: payload.userId } });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
