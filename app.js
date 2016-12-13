'use strict';

const tray = require('./src/backend/services/tray');
const db = require('./src/backend/services/db');
const logger = require('./src/backend/services/logger');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

logger.info('Starting the app');

// Create/load the Tray
tray.create();

// Load databases (disk)
db.init()
  .then(() => {
    logger.info('Databases loaded');
  })
  .catch((error) => {
    logger.error(error);
  });

// Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/app', express.static(__dirname + '/src/ui'));

app.listen(3000, function () {
  logger.info('App started'); // todo: reliable port discovery
});

app.get('/', (req, res) => {
  res.redirect('/app');
});
