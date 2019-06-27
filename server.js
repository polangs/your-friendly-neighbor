
'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// database Setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('error', err => console.error(err));

// routes
app.get('/', loadHome);
// app.get('/', getPopular);
app.post('/search', handleSearch);
// app.get('/dashboard', handleDashboard); // created for Paula to style Dashboard page for now
app.get('/location', handleLocation);
app.get('/events', handleEvents);
app.get('/restaurants', handleRestaurants);
// app.get('/popular', getPopular);
// app.post('/popular-queries', 'write a sql function here to find popular past searches and search again from the selection')

// internal modules
const getLocation = require('./modules/location');
const getEvents = require('./modules/events');
const getRestaurants = require('./modules/restaurants');

// We switched app.get('/'loadHome') with ('/'getPopular) to load SQL Data
function loadHome(req, res) {
  res.render('pages/index');
}

// route handler for location
function handleLocation(req, res) {
  getLocation(req.body.search, superagent)
    .then(location => res.send(location))
    .catch(error => handleError(error, res));
}

// route handler for events
function handleEvents(req, res) {
  getEvents(req.query.location, superagent)
    .then(events => {
      res.render('pages/events', { events: events });
    })
    .catch(error => handleError(error, res));
}

// route handler for restaurants based on location
function handleRestaurants(req, res) {
  getRestaurants(req.query.location, superagent)
    .then(restaurants => {
      // res.send(restaurants)
      res.render('pages/restaurants', { restaurants: restaurants });
    })
    .catch(error => handleError(error, res));
}



// route handler for search location entered by user
function handleSearch(req, res) {

  getLocation(req.body.search, superagent)
    .then(location => res.render('pages/new', location))
    .catch(error => handleError(error, res));
}

//////////// if the search is not in the sql database

// function getPopular(req, res) {
//   let SQL = `SELECT * FROM popular`;
//   return client.query(SQL)
//     .then(places => {
//       console.log(places.rows);
//       res.render('pages/index', { popularLocations: places.rows })
//     })

// }

// function cacheLocation(location, client) {
//   // console.log('caching query);
//   const SQL = `INSERT INTO popular (query, formatted_query, latitude, longitude) VALUES (${
//     location.query}, ${location.formatted_query}, ${location.latitude}, ${location.longitude}`;
//   return client.query(SQL).then(results => {
//     return location;
//   });
// }
// function cacheLocation(location, client) {
//   const insertSQL = `
//     INSERT INTO locations (search_query, formatted_query, latitude, longitude)
//     VALUES('${location.search_query}','${location.formatted_query}', ${
//   location.latitude
// }, ${location.longitude})
//     RETURNING id;
// `;

//   return client.query(insertSQL).then(results => {
//     // console.log('location results from db', results);

//     // console.log('location results id', results.rows[0].id);

//     location.id = results.rows[0].id;

//     // console.log(' new location object ', location);

//     return location;
//   });
// }


//////////////////////////

// function handleDashboard(req, res) {
//   res.render('pages/dashboard', { tbd: 'Coming Soon' });
// }
    




function handleError(error, response) {
  console.error(error);
  response.status(500).send('I\'m sorry! we have run into a problem. Please try again later.');
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
