'use strict';

const tray = require('./src/backend/services/tray');
const db = require('./src/backend/services/db');
const sh = require('./src/backend/services/sh'); 
const filesystem = require('./src/backend/services/filesystem');

// Create/load the Tray
tray.create();

// Load databases (disk)
db.load(() => {
  db.save(db.DB.PASSPHRASE, { 'hello': 'world' });
});

// Test the crypto
sh.encrypt(filesystem.getFilesDirectory() + '/test.txt', 'foobarbaz')
  .then(() => {
    return sh.decrypt(filesystem.getFilesDirectory() + '/test.txt.enc', 'foobarbaz');
  })
  .then(() => {
    console.log('done');
  })
  .catch((error) => {
    console.error(error);
  });