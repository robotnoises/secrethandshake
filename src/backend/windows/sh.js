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

// todo

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
    // bridge.setItem(createdWin, 'files', tempFiles);
  } else {
    logger.info('Main window not found, creating');
    createNew();
  }
}

module.exports = {
  show: show
};
