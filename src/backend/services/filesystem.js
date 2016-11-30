'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const logger = require('./../../global/logger');

/**
 * getHomeDirectory()
 * 
 * Find the User's default "home" directory in a platform agnostic manner
 */

function verifyDir(pathToDir) {
  if (!fs.existsSync(pathToDir)) {
    return fs.mkdirSync(pathToDir);
  } else {
    return;
  }
}

function getBaseDirectory() {
  return path.join(os.homedir(), '.secrethandshake');
}

function getLogsDirectory() {
  let pathToDir = path.join(getBaseDirectory(), 'logs');
  verifyDir(pathToDir);
  return pathToDir;
}

function getDatabaseDirectory() {
  return path.join(getBaseDirectory(), 'databases');
}

function getFilesDirectory(suffix) {
  let end = suffix || '';
  return path.join(getBaseDirectory(), 'files', end);
}

/**
 * moveToFiles(file: Object)
 * 
 * Move a file to the "files" directory
 * 
 * Note: the "file" must be an ShFile Object 
 */

function moveToFiles(file) {
  return new Promise((resolve, reject) => {  
    let rd = fs.createReadStream(file.path);
    var wr = fs.createWriteStream(getFilesDirectory(file.name));

    function rejectCleanup(err) {
      rd.destroy();
      wr.end();
      reject(err);
    }
    
    rd.on('error', rejectCleanup);
    wr.on('error', rejectCleanup);
    wr.on('finish', () => {
      resolve(file);
    });

    rd.pipe(wr);
  });
}

module.exports = {
  getBaseDirectory: getBaseDirectory,
  getLogsDirectory: getLogsDirectory,
  getDatabaseDirectory: getDatabaseDirectory,
  getFilesDirectory: getFilesDirectory,
  moveToFiles: moveToFiles
};