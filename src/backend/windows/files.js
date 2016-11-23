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

function createNew(callback) {

  windowService.create('127.0.0.1:3000/app', { show: false }, (win) => {
    createdWin = win;
    
    // Events

    win.on('loaded', () => {
      win.show();
      callback();
    });

    win.on('close', () => {
      win.hide();
    });
  });
}

let tempFiles = [
  { id: 0, name: 'foo.txt', updated: new Date('11/03/2016') },
  { id: 1, name: 'bar.txt', updated: new Date('12/01/2015') },
  { id: 2, name: 'baz.txt', updated: new Date('09/19/2016') },
  { id: 3, name: 'fart.docx', updated: new Date('10/11/2016') },
  { id: 4, name: 'cool document.xslx', updated: new Date('10/30/2016') },
  { id: 5, name: 'aaaaaaaa.pptx', updated: new Date('08/03/2016') },
  { id: 6, name: 'manifesto.txt', updated: new Date('07/04/2016') }
];

function loadFiles() {
  message.send(createdWin.window, {
    type: 'filesloaded',
    value: tempFiles
  });

  setTimeout(() => {
    tempFiles.push({ id: 7, name: 'reactToAddedFile.awesome', updated: new Date('11/23/2016') });
    message.send(createdWin.window, {
      type: 'filesloaded',
      value: tempFiles
    });
  }, 5000);
}

/**
 * Public
 */

function show() {
  logger.info('Showing main window');

  if (createdWin) {
    createdWin.show();
    loadFiles();
  } else {
    logger.info('Main window not found, creating');
    createNew(loadFiles);
  }
}

module.exports = {
  show: show
};
