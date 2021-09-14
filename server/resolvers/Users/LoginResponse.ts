import { Field, ObjectType } from 'type-graphql';
import { User } from '../../prisma/generated/type-graphql';

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken!: string;

  @Field()
  user!: User;
}
