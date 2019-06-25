'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');

// Application Setup/dependencies
const app = express();
const PORT = process.env.PORT || 3000;

//added to look into objects
const util = require('util');

// Application Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));//all set to static and would be available to view publicly


app.listen(PORT, () => console.log(`Listening on ${PORT}`));