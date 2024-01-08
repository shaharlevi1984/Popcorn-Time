var express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
var router = express.Router();
require('dotenv').config()

// TMDB Api Routes:
router.get('/tmdb/guest_session_id', async (request, response) => {
    const options = {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.TMDB_API_TOKEN}`
      }
    };
  
    try {
        const fetch = await import('node-fetch');
        const responseApi = await fetch.default(process.env.TMDB_CREATE_GUEST_SESSION,options);
        const result = await responseApi.json();
        console.log(result.guest_session_id)
        response.send(result.guest_session_id);
    } catch (error) {
        console.error(error);
        response.status(500).send('Error fetching data');
    }
  })
  
router.get('/tmdb/movies/popular', async (_, response) => {
    const api_url = process.env.TMDB_POPULAR_MOVIES
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
        }
    };

    try {
        const fetch = await import('node-fetch');
        const responseApi = await fetch.default(api_url, options);
        const data = await responseApi.json();
        response.send(data.results);
    } catch (error) {
        console.error(error);
        response.status(500).send('Error fetching data');
    }
})

router.get('/tmdb/movies/upcoming', async (_, response) => {
    const api_url = process.env.TMDB_UPCOMING_MOVIES
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
        }
    };

    try {
        const fetch = await import('node-fetch');
        const responseApi = await fetch.default(api_url, options);
        const data = await responseApi.json();
        response.send(data.results);
    } catch (error) {
        console.error(error);
        response.status(500).send('Error fetching data');
    }
})

router.get('/tmdb/movies/top_rated', async (_, response) => {
    const api_url = process.env.TMDB_TOP_RATED_MOVIES
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
        }
    };

    try {
        const fetch = await import('node-fetch');
        const responseApi = await fetch.default(api_url, options);
        const data = await responseApi.json();
        response.send(data.results);
    } catch (error) {
        console.error(error);
        response.status(500).send('Error fetching data');
    }
})

// YTS Api Routes:
router.get('/yts/movies', async (_, response) => {
    const api_url = process.env.YTS_MOVIES;
    try {
        const fetch = await import('node-fetch');
        const responseApi = await fetch.default(api_url);
        const result = await responseApi.json();
        response.send(result.data.movies);
    } catch (error) {
        console.error(error);
        response.status(500).send('Error fetching data');
    }
})


module.exports = router;