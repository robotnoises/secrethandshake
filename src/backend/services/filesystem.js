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

function getHomeDirectory() {
  return os.homedir();
}

function getDatabaseDirectory() {
  return path.join(getHomeDirectory(), '.secrethandshake', 'databases');
}

function getFilesDirectory() {
  return path.join(getHomeDirectory(), '.secrethandshake', 'files');
}

function getLogsDirectory() {
  let pathToDir = path.join(getHomeDirectory(), '.secrethandshake', 'logs');
  verifyDir(pathToDir);
  return pathToDir;
}

module.exports = {
  getHomeDirectory: getHomeDirectory,
  getDatabaseDirectory: getDatabaseDirectory,
  getFilesDirectory: getFilesDirectory,
  getLogsDirectory: getLogsDirectory
};