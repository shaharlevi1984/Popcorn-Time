// Bussiness Logic - DB Queries

const getAllMovies = () =>  {
    return 'SELECT * FROM movies';
}

const addMovie = (id, title, year, length, rating, genres, directors, cast, poster_path, plot) => {
  return `INSERT INTO movies (imdb_id, title, year, length, rating, genres, directors, cast, poster_path, plot) VALUES ("${id}", "${title}", ${year}, "${length}", ${rating}, "${genres}" ,"${directors}", "${cast}", "${poster_path}", "${plot}")`;
};

const deleteMovie = () => {
  return 'DELETE FROM movies WHERE imdb_id = ?'
}

const getMovieId = (id) => {
  return 'SELECT imdb_id, title FROM movies WHERE imdb_id=' +`'${id}'`;
};

  // Export the query functions
module.exports = {
    getAllMovies,
    getMovieId,
    addMovie,
    deleteMovie,
};