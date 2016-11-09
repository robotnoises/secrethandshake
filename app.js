'use strict';

const tray = require('./src/backend/services/tray');
const db = require('./src/backend/services/db');
const logger = require('./src/global/logger'); 

logger.info('Starting the app');

// Create/load the Tray
tray.create();

// Load databases (disk)
db.load()
  .then(() => {
    logger.info('Databases loaded');
  })
  .catch((error) => {
    logger.error(error);
  });

logger.info('App started');