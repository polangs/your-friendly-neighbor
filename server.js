
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

// routes
app.get('/location', handleLocation);
app.get('/events', handleEvents);
// app.get('/restaurants', handleRestaurant);

// internal modules
const getLocation = require('./modules/location');
// const getEvents = require('./modules/events');
// const getEvents = require('./modules/restaurants');

// route handler for location
function handleLocation(req, res) {
  getLocation(req.query.data, superagent)
    .then(location => res.send(location))
    .catch(error => handleError(error, res));
}

// route handler for events
function handleEvents(req, res){
  getEvents(req.query)
    .then(events => res.send(events))
    .catch(error => handleError(error, res) )
}

// pass in superagent to getEvents when modularize to events.js
function getEvents(query){
  console.log('query', query);
  let URL = `https://www.eventbriteapi.com/v3/events/search?location.address=${query.formatted_query}&location.within=1km`
  return superagent.get(URL)
    .set('Authorization', `Bearer ${process.env.EVENT_BRITE}`)
    .then(data => data.body.events.map(event => new Event(event)));
}

function Event(event){
  this.link = event.url,
  this.name= event.name.text,
  this.event_date = event.start.local,
  this.summary = event.summary
}

// route handler for location
// function handleRestaurants(req, res) {
//   getRestaurants(req.query.location, superagent)
//     .then(restaurants => res.send(restaurants))
//     .catch(error => handleError(error, res));
// }

// function getRestaurants

function handleError(error, response) {
  console.error(error);
  response.status(500).send('I\'m sorry! we have run into a problem. Please try again later.');
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`) );
