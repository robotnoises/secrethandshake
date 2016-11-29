'use strict';

const path = require('path');
const filesystem = require('./filesystem');
const Datastore = require('nedb');
const config = require('./../../global/config'); // todo: this path sucks
const logger = require('./../../global/logger'); // todo: same

/**
 * Private
 */

function loadDb(prop, name) {
  return new Promise((resolve, reject) => {
    if (databases[prop]) {
      databases[prop] = new Datastore({ filename: path.join(filesystem.getDatabaseDirectory(), name + '.db') })
      databases[prop].loadDatabase(() => {
        logger.info('loaded db:', prop);
        resolve();
      });
    } else {
      reject(new Error('Database ' + prop + ' not found'));
    }
  });
}

/**
 * Public
 */

let databases = {
  passphrase: {},
  passphraseTest: {},
  files: {}
};

/**
 * Load all databases
 */
function init() {
  return loadDb('passphrase', 'passphrase')
    .then(() => loadDb('passphraseTest', 'passphrase.test'))
    .then(() => loadDb('files', 'files'))
    .catch(error => logger.error(error));
}

function read(db, query) {
  return new Promise((resolve, reject) => {
    let q = query || {};

    db.find(q, (err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs || []);
      }
    });
  });
}


function remove(db, query) {
  return new Promise((resolve, reject) => {
    let q = query || {};

    db.remove(q, { multi: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function save(db, data) {
  return new Promise((resolve, reject) => {
    db.insert(data, err => {
      if (err) {
        logger.error('db save error:', err);
        reject(err);
      } else {
        logger.info('db (' + db.filename + ') save success: ', data);
        resolve(data);
      }
    });
  });
}

module.exports = {
  databases: databases,
  init: init,
  read: read,
  save: save,
  remove: remove
};