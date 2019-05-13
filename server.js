import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
const express = require('express');


const port = process.env.PORT || 9000;
const app = express();
const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.graphql',{encoding:'utf-8'})
const resolvers = require('./resolvers')

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: port }, () =>{
  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`)
})
