const { gql } = require("apollo-server");

module.exports.typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    books: [Book]
  }
`;
