'use strict';

const path = require('path');
const windowService = require('./index');
const bridge = require('./../../global/bridge');
const logger = require('./../../global/logger');

/**
 * Private
 */

let createdWin;

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

    // Bridge methods

    bridge.addItem(win.window, 'setPassphraseTest', (passphrase) => {
      logger.info('Setting passphrase (test):', passphrase);
    });
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
