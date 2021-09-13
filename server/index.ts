import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '.prisma/client';
import { PostResolver } from './resolvers/posts.resolvers';
import { UserResolver } from './resolvers/Users/users.resolvers';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MyContext } from './Context';
import { TestResolver } from './resolvers/test.resolvers';
import refreshToken from './refreshToken';

dotenv.config();
const prisma = new PrismaClient();
const PORT = 4000;
const app = express();
app.use(cookieParser());

const main = async () => {
  app.post('/refresh-token', refreshToken);

  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver, TestResolver],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({ req, res, prisma }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(PORT, () => console.log('Listening on port 4000'));
};

main().catch((error) => console.log(error));
