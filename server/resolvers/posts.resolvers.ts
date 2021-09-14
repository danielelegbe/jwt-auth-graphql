import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import {
  Resolver,
  Int,
  Query,
  FieldResolver,
  Root,
  Mutation,
  Args,
  Field,
  InputType,
  Arg,
} from 'type-graphql';
import { Post, User } from '../prisma/generated/type-graphql/models/index';

const prisma = new PrismaClient();

@InputType()
class NewPostTypes {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  content!: string;

  @Field(() => Int)
  authorId!: number;
}

//Resolvers
@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await prisma.post.findMany();
  }

  @FieldResolver(() => User)
  async user(@Root() parent: Post): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({
      where: { id: parent.authorId },
    });
    return foundUser;
  }

  @Mutation(() => Post)
  async newPost(
    @Arg('data') { content, title, authorId }: NewPostTypes
  ): Promise<Post> {
    const newPost = await prisma.post.create({
      data: { content, title, authorId },
    });
    console.log(newPost);
    return newPost;
  }
}
