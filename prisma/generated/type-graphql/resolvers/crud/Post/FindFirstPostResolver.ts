import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstPostArgs } from "./args/FindFirstPostArgs";
import { Post } from "../../../models/Post";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Post)
export class FindFirstPostResolver {
  @TypeGraphQL.Query(_returns => Post, {
    nullable: true
  })
  async findFirstPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstPostArgs): Promise<Post | null> {
    return getPrismaFromContext(ctx).post.findFirst(args);
  }
}
