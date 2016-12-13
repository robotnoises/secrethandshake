'use strict';

const path = require('path');
const windowService = require('./index');
const db = require('./../services/db'); 
const passphrase = require('./../services/passphrase'); 
const message = require('./../services/message');
const bridge = require('./../services/bridge');
const logger = require('./../services/logger');

let createdWin;

/**
 * Bridge methods
 */

function saveTestPassphrase(input) {
  logger.info('Setting passphrase (test):', input);
  
  passphrase.hash(input)
    .then(hashed => {
      return db.save(db.databases.passphraseTest, { passphrase: hashed });
    })
    .then(hashResult => {
      return passphrase.check(input, hashResult.passphrase);
    })
    .then(match => {
      logger.info('match?', match);
      message.send(createdWin.window, new message.Notification('setPassphraseTestResult', match));
    })
    .catch(error => logger.error(error));
}

/**
 * Private Window functions
 */

function createNew() {
  let tempPath = path.join('src', 'ui', 'components', 'test', 'test.html');

  windowService.create(tempPath, { show: false }, (win) => {
    createdWin = win;
    
    // Events

    win.on('loaded', () => {
      win.show();
    });

    win.on('close', () => {
      win.hide();
    });

    // Bridge methods/properties

    bridge.setItem(win.window, 'setPassphraseTest', saveTestPassphrase);
  });
}

/**
 * Public
 */

function show() {
  logger.info('Showing test window');

  if (createdWin) {
    createdWin.show();
  } else {
    logger.info('Test window not found, creating');
    createNew();
  }
}

module.exports = {
  show: show
};
