import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { Prisma } from '@prisma/client';
import { DecimalJSScalar } from '../scalars';
import { Post } from '../models/Post';

@TypeGraphQL.ObjectType({
  isAbstract: true,
})
export class User {
  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: false,
  })
  id!: number;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  email!: string;

  password!: string;

  posts?: Post[];

  token_version!: number;
}
