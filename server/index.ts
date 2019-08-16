import { ApolloServer } from "apollo-server";
import { resolvers } from "./graphql/resolvers";
import fs from "fs";

const typeDefs = fs.readFileSync("./schema.graphql").toString();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
