'use strict';

const path = require('path');
const windowService = require('./index');
const bridge = require('./../../global/bridge');
const logger = require('./../../global/logger');
const db = require('./../services/db'); 
const passphrase = require('./../services/passphrase');
const message = require('./../services/message');
const filesystem = require('./../services/filesystem');
const encryption = require('./../services/encryption');
const _ = require('lodash');

const ERROR = require('./../services/error');
const FILESTATE = require('./../services/filestate');

let createdWin;

/**
 * Models
 */

// todo: move these

function ShFile(file) {
  this.name = file.name;
  this.path = file.path;
  this.shPath = path.join(filesystem.getFilesDirectory(), file.name);
  this.lastModified = file.lastModified;
  this.lastModifiedDate = file.lastModifiedDate;
  this.size = file.size;
  this.type = file.type;
  this.dropId = file.dropId || dropId(file.path);
  this.error = (typeof file.error !== 'undefined') ? file.error : null;
  this.state = (typeof file.state !== 'undefined') ? file.state : FILESTATE.PROCESSING;
}

function ShPassphrase(hash) {
  this.value = hash;
  this.lastModified = new Date();
}

/**
 * Private Window functions
 */

function dropId(originalFilePath) {
  return Date.now() + originalFilePath.split(/[\\\/\s]/gi).join('.');
}

function openFile(file) {
  let f = new ShFile(file);
  if (f.state === FILESTATE.DECRYPTED) {
    return filesystem.openFile(f.shPath);
  } else {
    return encryption.decrypt(f.shPath, 'foobarbaz')
      .then(() => {
        return filesystem.openFile(f.shPath);
      })
      .then(() => {
        f.state = FILESTATE.DECRYPTED;
        return db.update(db.databases.files, file._id, f);
      })
      .then((updatedFile) => {
        // Notify UI
        message.send(createdWin.window, new message.Notification('fileupdated', updatedFile));
      })
      .catch((error) => {
        logger.error(error);
      });
  }
}

function deleteFile(file) { 
  return filesystem.removeFile(file.shPath)
    .then(() => {
      return db.remove(db.databases.files, { _id: file._id});
    })
    .then(() => {
      message.send(createdWin.window, new message.Notification('fileremoved', file))
    });
}

function moveFile(file) {
  return db.read(db.databases.files, { name: file.name })
    .then((docs) => {
      if (docs.length > 0) {
        logger.warn('Name conflict:', file.name);
        
        // Set error state
        file.error = ERROR.FILE_NAMECONFLICT;
        file.state = FILESTATE.ERROR;

        // Notify UI
        message.send(createdWin.window, new message.Notification('fileupdated', file));

        // If the file is not moved, resolve with null, which will be checked in 
        // the subsequent "encryptFile" function.
        return Promise.resolve(null);
      } else {
        logger.info('Moving file:', file.name);
        
        // Notify UI
        message.send(createdWin.window, new message.Notification('fileupdated', file));

        return filesystem.moveToFiles(file);
      }
    });
}

function encryptNewFile(file, passphrase) {
  if (passphrase) {
    return new Promise(resolve => {
      encryption.encrypt(file.shPath, passphrase)
        .then(() => {
          file.state = FILESTATE.ENCRYPTED; 
          return db.save(db.databases.files, file);
        })
        .then(savedFile => {
          message.send(createdWin.window, new message.Notification('fileupdated', savedFile));
          resolve(savedFile);
        })
        .catch(error => {
          logger.error(error);
        });
    });
  } else {
    return Promise.reject('Passphrase is required');
  }
}

function reencryptFile(file, passphrase) {
  if (passphrase) {
    return new Promise((resolve) => {
      let shFile = new ShFile(file);
      encryption.encrypt(shFile.shPath, passphrase)
        .then(() => {
          shFile.state = FILESTATE.ENCRYPTED; 
          return db.update(db.databases.files, file._id, shFile);
        })
        .then(updatedFile => {
          if (updatedFile) {
            message.send(createdWin.window, new message.Notification('fileupdated', updatedFile));
          }
        })
        .catch(error => {
          logger.error(error);
        });
    });
  } else {
    return Promise.reject('Passphrase is required');
  }
}

function setPassphrase(input) {
  logger.info('Setting passphrase');
  // todo: logic for wiping-out old passphrase after update
  return passphrase.hash(input)
    .then((hashed) => {
      return db.save(db.databases.passphrase, new ShPassphrase(hashed));
    });
}

function checkPassphrase(input) {
  logger.info('Checking passphrase');
  return db.read(db.databases.passphrase)
    .then((hashed) => {
      if (hashed && hashed[0]) {
        return passphrase.check(input, hashed[0].value);
      } else {
        return Promise.reject('Passphrase not found');
      }
    });
}

/**
 * Bridge methods
 */

// todo: unlink original source file after successfully encrypting

function processFiles(files) {  
  let movingFiles = [];
  let encryptingFiles = [];

  for (var i = 0, iMax = files.length; i < iMax; i++) {
    let file = new ShFile(files[i]);
    movingFiles.push(moveFile(file));
  }

  Promise.all(movingFiles)
    .then((movedFiles) => {
      for (var j = 0, jMax = movedFiles.length; j < jMax; j++) {
        // Some files will not be moved due to name conflicts and errors.
        // If that is the case, the returned value will be null.
        if (movedFiles[j]) {
          encryptingFiles.push(encryptNewFile(movedFiles[j], 'foobarbaz')); // todo: accept this from User
        }
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
      logger.info('Hiding main window');
      win.hide();
    });

    // Bridge methods
    bridge.setItem(win.window, 'consumeFiles', processFiles);
    bridge.setItem(win.window, 'reencryptFile', reencryptFile);
    bridge.setItem(win.window, 'openFile', openFile);
    bridge.setItem(win.window, 'deleteFile', deleteFile);
    bridge.setItem(win.window, 'setPassphrase', setPassphrase);
    bridge.setItem(win.window, 'checkPassphrase', checkPassphrase);
  });
}

function loadFiles() {
  db.read(db.databases.files)
    .then((files) => {
      message.send(createdWin.window, new message.Notification('filesloaded', _.keyBy(files, 'dropId')));
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
