'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

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

function getFilesDirectory() {
  return path.join(getBaseDirectory(), 'files');
}

module.exports = {
  getBaseDirectory: getBaseDirectory,
  getLogsDirectory: getLogsDirectory,
  getDatabaseDirectory: getDatabaseDirectory,
  getFilesDirectory: getFilesDirectory
};