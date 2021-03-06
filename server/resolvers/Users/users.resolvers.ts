import 'reflect-metadata';
import { hash, verify } from 'argon2';
import { PrismaClient } from '@prisma/client';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Post, User } from '../../prisma/generated/type-graphql/models/index';
import { IsEmail, Length } from 'class-validator';
import LoginResponse from './LoginResponse';
import { MyContext } from '../../Context';
import { createAccessToken, createRefreshToken } from '../../authTokens';
import { ApolloError } from 'apollo-server-errors';
import { sendRefreshCookie } from './sendRefreshCookie';
const prisma = new PrismaClient();

// Arg Types
@ArgsType()
class FindOneUserArgs {
  @Field(() => Int)
  id!: number;
}

@InputType()
class NewUserInput {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @Length(6, 255, { message: 'password must be at least 6 characters' })
  password!: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  @FieldResolver(() => [Post])
  async posts(@Root() parent: User): Promise<Post[]> {
    return await prisma.user.findUnique({ where: { id: parent.id } }).posts();
  }

  @Query(() => User, { nullable: true })
  async findOneUser(@Args() { id }: FindOneUserArgs): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({ where: { id } });
    if (foundUser) {
      return foundUser;
    }
    return null;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('data') { email, password }: NewUserInput
  ): Promise<boolean> {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ApolloError('User already exists');
    else {
      const hashedPassword = await hash(password);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      return true;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Ctx() { res, prisma }: MyContext,
    @Arg('data') { email, password }: NewUserInput
  ): Promise<LoginResponse> {
    const foundUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) throw new Error('user does not exist');

    const passwordIsValid = await verify(foundUser.password, password);

    if (!passwordIsValid) {
      throw new Error('Invalid password');
    }

    sendRefreshCookie(res, createRefreshToken(foundUser));

    return {
      accessToken: createAccessToken(foundUser),
      user: foundUser,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    sendRefreshCookie(res, '');
    return true;
  }

  @Mutation(() => User)
  async revokeRefreshTokensForUser(
    @Args() { id }: FindOneUserArgs
  ): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        token_version: {
          increment: 1,
        },
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
