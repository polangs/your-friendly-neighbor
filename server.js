
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

// routes
app.get('/', loadHome);
app.get('/location', handleLocation);
app.get('/events', handleEvents);
app.get('/restaurants', handleRestaurants);

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
  getEvents(req.query, superagent)
  .then(events => res.send(events))
  .catch(error => handleError(error, res));
}

// route handler for restaurants based on location
function handleRestaurants(req, res) {
  console.log(req.query.location);
  getRestaurants(req.query.location, superagent)
    .then(restaurants => res.send(restaurants))
    .catch(error => handleError(error, res));
}

function handleError(error, response) {
  console.error(error);
  response.status(500).send('I\'m sorry! we have run into a problem. Please try again later.');
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
