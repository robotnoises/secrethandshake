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

function moveToFiles(sourcePath, fileName) {
  return new Promise((resolve, reject) => {  
    let rd = fs.createReadStream(sourcePath);
    var wr = fs.createWriteStream(getFilesDirectory(fileName));

    function rejectCleanup(err) {
      rd.destroy();
      wr.end();
      reject(err);
    }
    
    rd.on('error', rejectCleanup);
    wr.on('error', rejectCleanup);
    wr.on('finish', resolve);

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