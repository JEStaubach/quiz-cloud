const { gql } = require('apollo-server');

module.exports.typeDefs = gql`
  type Subject {
    id: ID
    name: String
    domains: [Domain]
  }

  type Domain {
    id: ID
    name: String
    questions: [Question]
  }

  type Question {
    id: ID
    text: String
    parameters: Parameters
    options: [Option]
  }

  type Parameters {
    id: ID
    numChoices: Int
    minCorrect: Int
    maxCorrect: Int
  }

  interface Option {
    id: ID
    type: String
  }

  type Choice implements Option {
    id: ID
    type: String
    text: String
    isCorrect: Boolean
    rationale: String
  }

  type Match implements Option {
    id: ID
    type: String
    term: String
    definition: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    subjects: [Subject]
  }
`;
