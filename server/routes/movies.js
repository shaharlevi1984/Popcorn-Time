var express = require('express');
var router = express.Router();
const getConnection = require('../Database/connection')
const queries = require('../Database/queries');
require('dotenv').config()

/* GET home page. */

router.get('/', async (_, response) => {
  const query = queries.getAllMovies();
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(query);

    if (!queryResult || queryResult.length === 0) {
      response.status(404).send('Employee Not Found!');
      connection.release();
      return;
    }
    connection.release();
    response.send(queryResult)
  } catch (error) {
    console.error(error);
    response.status(500).send('An error occurred');
  }
});

router.get('/:id', async (request, response) => {
  const movie_id = request.params.id;
  const query = queries.getMovieId(movie_id);
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(query);

    if (!queryResult || queryResult.length === 0) {
      response.status(404).send('Movie Not Found!');
      connection.release();
      return;
    }

    connection.release();
    response.send(queryResult);
  } catch (error) {
    console.error(error);
    response.status(500).send('An error occurred');
  }
});

router.post('/addMovie', async (request, response) => {
  console.log(request.body);

  const { id, title, year, length, rating, genres, directors, cast, poster_path, plot } = request.body;
  const params = { id, title, year, length, rating, genres, directors, cast, poster_path, plot };
  const query = queries.addMovie(id, title, year, length, rating, genres, directors, cast, poster_path, plot);

  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(query, params);

    if (!queryResult || queryResult.affectedRows === 0) {
      response.status(404).send('Add Movie Failed');
      connection.release();
      return;
    }

    connection.release();
    response.send('Movie added successfully!');
  } catch (error) {
    console.error(error);
    response.status(500).send('An error occurred');
  }
});

router.delete('/deleteMovie/:id', async (request, response) => {
  const movieId = request.params.id;
  console.log(movieId)
  const query = queries.deleteMovie()
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(query, [movieId]);

    if (!queryResult || queryResult.affectedRows === 0) {
      response.status(404).send('Delete Movie Failed');
      connection.release();
      return;
    }
    connection.release();
    response.status(200).json({ message: 'Movie deleted successfully.' });

  } catch (error) {
    console.error('Error deleting movie:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;