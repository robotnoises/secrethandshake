'use strict';

const tray = require('./src/backend/services/tray');
const db = require('./src/backend/services/db');
const crypto = require('./src/backend/services/crypto'); 
const filesystem = require('./src/backend/services/filesystem');

// Create/load the Tray
tray.create();

// Load databases (disk)
db.load(() => {
  db.save(db.DB.PASSPHRASE, { 'hello': 'world' });
});

// Test the crypto
crypto.encypt(filesystem.getFilesDirectory() + '/test.txt', 'foobarbaz')
  .then(() => {
    console.log('done');
  })
  .catch((error) => {
    console.error(error);
  });