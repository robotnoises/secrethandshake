'use strict';

const path = require('path');
const windowService = require('./index');
const bridge = require('./../../global/bridge');
const logger = require('./../../global/logger');
const db = require('./../services/db'); 
const passphrase = require('./../services/passphrase');
const message = require('./../services/message');
const filesystem = require('./../services/filesystem');
const sh = require('./../services/sh');
const FILESTATE = require('./../services/filestate');

let createdWin;

/**
 * Models
 */

function ShFile(file) {
  this.name = file.name;
  this.path = file.path;
  this.shPath = path.join(filesystem.getFilesDirectory(), file.name);
  this.lastModified = file.lastModified;
  this.lastModifiedDate = file.lastModifiedDate;
  this.size = file.size;
  this.type = file.type;
  this.error = null;
  this.state = FILESTATE.PROCESSING;
}

/**
 * Private Window functions
 */

function encryptFile(file, passphrase) {
  if (passphrase) {
    return new Promise((resolve) => {
      logger.info('Encrypting file:', file.name);
      sh.encrypt(path.join(filesystem.getFilesDirectory(), file.name), passphrase)
        .then(() => {
          file.state = FILESTATE.ENCRYPTED; // this is assumed for now, and the state should flip to "ERROR" in the event of an error 
          return db.save(db.databases.files, file);
        })
        .then((savedFile) => {
          message.send(createdWin.window, new message.Notification('filedone', savedFile));
          resolve();
        })
        .catch((errorFile) => {
          message.send(createdWin.window, new message.Notification('filedone', errorFile));
        });
    });
  } else {
    return Promise.reject('Passphrase is required');
  }
}

/**
 * Bridge methods
 */

// todo: unlink original source file after successfully encrypting
// todo: namecheck before moving the file

function processFiles(files) {  
  let movingFiles = [];
  let encryptingFiles = [];

  for (var i = 0, iMax = files.length; i < iMax; i++) {
    logger.info('Moving file:', files[i].name);
    movingFiles.push(filesystem.moveToFiles(files[i].path, files[i].name));
  }

  Promise.all(movingFiles)
    .then(() => {
      for (var j = 0, jMax = files.length; j < jMax; j++) {
        encryptingFiles.push(encryptFile(new ShFile(files[j]), 'foobarbaz'));
      }
      return Promise.all(encryptingFiles);
    })
    .then(() => {
      logger.info('Finished consuming file(s)');
    })
    .catch(error => {
      logger.error(error);
    });
}

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

    // Bridge methods
    bridge.setItem(win.window, 'consumeFiles', processFiles);
  });
}

function loadFiles() {
  db.read(db.databases.files)
    .then((files) => {
      message.send(createdWin.window, new message.Notification('filesloaded', files));
    })
    .catch(error => {
      logger.error(error);
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
    createNew(loadFiles);
  }
}

module.exports = {
  show: show
};
