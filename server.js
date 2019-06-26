
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

//database Setup
// const user = new pg.User(process.env.DATABASE_URL);
// user.connect();
// user.on('error', err => console.error(err));

// routes
app.get('/', loadHome);
app.post('/search', handleSearch);
app.get('/dashboard', handleDashboard);
app.get('/location', handleLocation);
app.get('/events', handleEvents);
app.get('/restaurants', handleRestaurants);
// app.post('/popular-queries', 'write a sql function here to find popular past searches and search again from the selection')

// internal modules
const getLocation = require('./modules/location');
const getEvents = require('./modules/events');
const getRestaurants = require('./modules/restaurants');

function loadHome(req, res) {
  res.render('pages/index');
}

// route handler for location
function handleLocation(req, res) {
  getLocation(req.query.data, superagent)
    .then(location => res.send(location))
    .catch(error => handleError(error, res));
}

// route handler for events
function handleEvents(req, res){
  getEvents(req.query.location, superagent)
    .then(events => {
      res.render('pages/events', {events: events});
    })
    .catch(error => handleError(error, res));
  }

// route handler for restaurants based on location
function handleRestaurants(req, res) {
  getRestaurants(req.query.location, superagent)
    .then(restaurants => {
      // res.send(restaurants)
      res.render('pages/restaurants', {restaurants: restaurants});
    })
    .catch(error => handleError(error, res));
}

// route handler for search location entered by user
function handleSearch(req, res) {
  // TODO: need to add GEO_CODE API hit then render
  // res.send(req.body);
  res.render('pages/new', {
    "search_query": "banff",
    "formatted_query": "Banff, AB, Canada",
    "latitude": 51.1783629,
    "longitude": -115.5707694
  });
}

function handleDashboard(req, res) {
  res.render('pages/dashboard', {tbd: 'Coming Soon'});
}

function handleError(error, response) {
  console.error(error);
  response.status(500).send('I\'m sorry! we have run into a problem. Please try again later.');
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
