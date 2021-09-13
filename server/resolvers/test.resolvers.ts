import 'reflect-metadata';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../Context';
import { isAuth } from '../isAuth';

@Resolver()
export class TestResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `user id is ${payload!.userId}`;
  }
}
