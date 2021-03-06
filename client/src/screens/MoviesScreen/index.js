import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';
import './moviesScreen.css';

import MovieCard from '../../components/MovieCard';

const FavCount = ({ count }) => {
  return <div className="favCount">
    <i className="fas fa-star fa-2x" />
    <i className="fas fa-circle" />
    <span className="favCountValue">{count}</span>
  </div>
}

const Movies = ({ movies, favorites = [], loading, loadMore }) => { //all inside the data prop
  if (loading) return null;

  return (
    <div className="moviesScreen">
      <div className="header">
        <h1 className="moviesTitle">Discover</h1>
        <Link to="/favorites" ><FavCount count={favorites.length} /></Link>
      </div>
      <div className="moviesResults">
        {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
      </div>
      <button className="button" onClick={loadMore}>
        Load More
      </button>
    </div>
  );
};

/**
 * TODO
 *   - Create HOC graphql component
 *   - Query for data required by movieCard
 *   - Extract movieCard query into a fragment on MovieCard
 *   - Expose relevant props from `data`
 *   - Add pagination using FetchMore
 */

export const MOVIES_QUERY = gql`
    query Movies($page: Int) {
      movies(page: $page) @connection(key: "Movies") {
        id
        ...MovieCard
      }
      favorites {
        id #we need a value otherwise it's wrong, even if we don't really use it 
      }
    }
    ${MovieCard.fragment}
  `

const withMovies = graphql(
  MOVIES_QUERY,
  {
    props: ({ data: { movies, favorites, loading, fetchMore } }) =>
      ({ 
        movies, 
        favorites,
        loading,
        loadMore: () => {
          /* determine the next page int */
          const nextPage = Math.floor(movies.length / 20) + 1;

          return fetchMore({
            variables: {
              page: nextPage
            },
            updateQuery: (previous, { fetchMoreResult }) => {
              if (!previous) return previous;

              return {
                ...previous,
                movies: [
                  ...previous.movies,
                  ...fetchMoreResult.movies
                ]
              };
            }
          });
        }
      })
  }
);

export default withMovies(Movies);
        