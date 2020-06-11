const getSubjects = async (context) => {
  const subjects = await context.pool.query('SELECT * FROM "Subjects" ORDER BY subject_id');
  return subjects.rows.map((subject) => ({
    id: subject.subject_id,
    name: subject.subject_name,
  }));
};

const getDomains = async (context, { subject_id }) => {
  const domains = await context.pool.query(
    `SELECT * FROM "Domains" WHERE subject_id=${subject_id} ORDER BY domain_id`,
  );
  return domains.rows.map((domain) => ({
    id: domain.domain_id,
    name: domain.domain_name,
  }));
};

const getQuestions = async (context, { domain_id }) => {
  const questions = await context.pool.query(
    `SELECT * FROM "Questions" WHERE domain_id=${domain_id} ORDER BY question_id`,
  );
  return questions.rows.map((question) => ({
    id: question.question_id,
    text: question.question_text,
    parameters: { q_id: question.question_id },
  }));
};

const getOptions = async (context, { question_id }) => {
  const choices = await context.pool.query(
    `SELECT * FROM "Choices" WHERE question_id=${question_id} ORDER BY choice_id`,
  );
  const matches = await context.pool.query(
    `SELECT * FROM "Matches" WHERE question_id=${question_id} ORDER BY match_id`,
  );
  if (choices.rows.length > 0) {
    return choices.rows.map((choice) => ({
      id: choice.choice_id,
      type: 'choice',
      text: choice.choice_text,
      isCorrect: choice.choice_isCorrect,
      rationale: choice.choice_rationale,
    }));
  }
  if (matches.rows.length > 0) {
    return matches.rows.map((match) => ({
      id: match.match_id,
      type: 'match',
      term: match.match_term,
      definition: match.match_definition,
    }));
  }
  return [];
};

const getParameters = async (context, { question_id }) => {
  const parameters = await context.pool.query(
    `SELECT * FROM "Parameters" WHERE question_id=${question_id} ORDER BY parameter_id`,
  );
  return {
    id: parameters.rows[0].parameter_id,
    numChoices: parameters.rows[0].parameter_numChoices,
    minCorrect: parameters.rows[0].parameter_minCorrect,
    maxCorrect: parameters.rows[0].parameter_maxCorrect,
  };
};

// Resolvers define the technique for fetching the types defined in the
// schema.
module.exports.resolvers = {
  Query: {
    subjects: async (__, _, context) => await getSubjects(context),
  },
  Subject: {
    domains: async (parent, _, context) => await getDomains(context, { subject_id: parent.id }),
  },
  Domain: {
    questions: async (parent, _, context) => await getQuestions(context, { domain_id: parent.id }),
  },
  Question: {
    options: async (parent, _, context) => await getOptions(context, { question_id: parent.id }),
    parameters: async (parent, _, context) => await getParameters(context, { question_id: parent.id }),
  },
  Option: {
    __resolveType(option) {
      switch (option.type) {
        case 'match': {
          return 'Match';
        }
        case 'choice': {
          return 'Choice';
        }
      }
    },
  },
};
