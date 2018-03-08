import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';
import '../MoviesScreen/moviesScreen.css';

import MovieCard from '../../components/MovieCard';


const Favorites = ({ favorites = [], loading }) => {
  if (loading) return null;

  return (
    <div className="moviesScreen">
      <div className="header">
        <h1 className="moviesTitle">Favorites</h1>
      </div>
      <div className="moviesResults">
        {favorites.map(movie => <MovieCard key={movie.id} {...movie} />)}
      </div>
    </div>
  );
};

const withMovies = graphql(
  gql`
  {
      favorites {
        id
        ...MovieCard
      }
    }
    ${MovieCard.fragment}
  `,
  {
    props: ({ data: { favorites, loading } }) => ({ 
      favorites,
      loading,
    })
  }
);

export default withMovies(Favorites);
        