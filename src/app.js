'use strict';
const express = require('express');
const morgan = require('morgan');
const app = express();

const authController = require('./controller/authController');

// Settings
app.set('port', process.env.PORT || 4000);

// Https views
app.use(morgan('dev'));

// Config Express Data
app.use(express.json());

// Form sends data, understand it, but not accept images etc...(Method of Express)
app.use(express.urlencoded({extended: true}));

app.use(authController);

module.exports = app;
