exports.type = `
  type Genre {
    id: ID!
    name: String!
  }

  extend type Query {
    genre(id: ID!): Genre
  }
`;

exports.resolvers = {
  Query: {
    genre: (root, { id }, { loaders }) => {
      return loaders.axios.load(['3/genre/movie/list'])
        .then(res => res.data.genres)
        .then(genres => genres.find(genre => genre.id === parseInt(id)));
    }
  }
};
