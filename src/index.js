const { ApolloServer } = require("apollo-server");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./schema");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: { apiKey: process.env.ENGINE_API_KEY },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
