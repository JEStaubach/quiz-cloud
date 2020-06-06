const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema.
module.exports.resolvers = {
  Query: {
    books: () => books,
  },
};
