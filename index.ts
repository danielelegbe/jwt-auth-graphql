import { PostResolver } from './resolvers/posts.resolvers';
import { UserResolver } from './resolvers/Users/users.resolvers';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import { PrismaClient } from '.prisma/client';
import { MyContext } from './Context';
import { TestResolver } from './resolvers/test.resolvers';
const prisma = new PrismaClient();
const PORT = 4000;
const app = express();

app.get('/hello', (req, res) => {
  res.send('hello');
});

const main = async () => {
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
