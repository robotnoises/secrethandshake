'use strict';

const tray = require('./src/backend/services/tray');
const db = require('./src/backend/services/db');

tray.create();

db.load(() => {
  db.save(db.DB.PASSPHRASE, { 'hello': 'world' });
});
