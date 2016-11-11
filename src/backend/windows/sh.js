'use strict';

const path = require('path');
const windowService = require('./index');
const bridge = require('./../../global/bridge');
const logger = require('./../../global/logger');
const db = require('./../services/db'); 
const passphrase = require('./../services/passphrase');
const message = require('./../services/message');

let createdWin;

/**
 * Bridge methods
 */

// function saveTestPassphrase(input) {
//   logger.info('Setting passphrase (test):', input);
  
//   passphrase.hash(input)
//     .then(hashed => {
//       return db.save(db.databases.passphraseTest, { passphrase: hashed });
//     })
//     .then(hashResult => {
//       return passphrase.check(input, hashResult.passphrase);
//     })
//     .then(match => {
//       logger.info('match?', match);
//       message.send(createdWin.window, {
//         type: 'setPassphraseTestResult',
//         value: match
//       })
//     })
//     .catch(error => logger.error(error));
// }

/**
 * Private Window functions
 */

function createNew() {

  windowService.create('127.0.0.1:3000/app', { show: false }, (win) => {
    createdWin = win;
    
    // Events

    win.on('loaded', () => {
      win.show();
    });

    win.on('close', () => {
      win.hide();
    });
  });
}

/**
 * Public
 */

function show() {
  logger.info('Showing main window');

  if (createdWin) {
    createdWin.show();
  } else {
    logger.info('Main window not found, creating');
    createNew();
  }
}

module.exports = {
  show: show
};
