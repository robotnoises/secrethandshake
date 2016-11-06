'use strict';

const path = require('path');
const filesystem = require('./filesystem');
const Datastore = require('nedb');

/**
 * Globals
 */

let databases = {};

/**
 * Public
 */

const DB = {
  PASSPHRASE: 'passphrase'
};

function load(done) {
  databases.passphrase = new Datastore({ filename: path.join(filesystem.getDatabaseDirectory(), 'passphrase.db') })
  databases.passphrase.loadDatabase(done);
}

function save(dbName, data) {
  databases[dbName].insert(data, err => {
    if (err) {
      // todo: log it
    } else {
      console.log('cool');
    }
  });
}

module.exports = {
  DB: DB,
  load: load,
  save: save
};