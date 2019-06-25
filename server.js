
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
// const getEvents = require('./modules/events');
// const getEvents = require('./modules/restaurants');

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
  getEvents(req.query)
  .then(events => res.send(events))
  .catch(error => handleError(error, res));
}

// pass in superagent to getEvents when modularize to events.js
function getEvents(query){
  console.log('query', query);
  const URL = `https://www.eventbriteapi.com/v3/events/search?location.address=${query.formatted_query}&location.within=1km`
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

// route handler for restaurants based on location
function handleRestaurants(req, res) {
  console.log(req.query.location);
  getRestaurants(req.query.location)
    .then(restaurants => res.send(restaurants))
    .catch(error => handleError(error, res));
}

// pass in superagent to getRestaurants when modularize to restaurants.js
function getRestaurants(location) {
  console.log('Yelp request', location);
  const URL = `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${location}`;

  return superagent.get(URL)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(response => response.body.businesses.map(restaurant => new Restaurant(restaurant)));
}

function Restaurant (restaurantData) {
  this.id = restaurantData.id;
  this.name = restaurantData.name;
  this.rating = restaurantData.rating;
  this.price = restaurantData.price;
  this.address = restaurantData.display_address;
  this.phoneNumber = restaurantData.display_phone;
  this.url = restaurantData.url;
}

function handleError(error, response) {
  console.error(error);
  response.status(500).send('I\'m sorry! we have run into a problem. Please try again later.');
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
