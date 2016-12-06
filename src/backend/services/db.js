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

    db.find(q, (error, docs) => {
      if (error) {
        logger.error('db read error:', error);
        reject(error);
      } else {
        logger.info('db (' + db.filename + ') read success');
        resolve(docs || []);
      }
    });
  });
}

function update(db, fileId, updatedData) {
  return new Promise((resolve, reject) => {
    db.update({ _id: fileId }, updatedData, { multi: false, returnUpdatedDocs: true }, (error, numAffected, updatedDoc) => {
      if (error) {
        logger.error('db update error:', error);
        reject(error);
      } else {
        logger.info('db (' + db.filename + ') updated ' + numAffected + ' doc(s)');
        resolve(updatedDoc);
      }
    });      
  });
}

function remove(db, query) {
  return new Promise((resolve, reject) => {
    let q = query || {};

    db.remove(q, { multi: true }, error => {
      if (error) {
        logger.error('db remove error:', error);
        reject(error);
      } else {
        logger.info('db (' + db.filename + ') remove success');
        resolve();
      }
    });
  });
}

function save(db, data) {
  return new Promise((resolve, reject) => {
    db.insert(data, (error, savedDoc) => {
      if (error) {
        logger.error('db save error:', error);
        reject(error);
      } else {
        logger.info('db (' + db.filename + ') save success');
        resolve(savedDoc);
      }
    });
  });
}

module.exports = {
  databases: databases,
  init: init,
  read: read,
  update: update,
  save: save,
  remove: remove
};