'use strict';

const os = require('os');
const path = require('path');

/**
 * getHomeDirectory()
 * 
 * Find the User's default "home" directory in a platform agnostic manner
 */

function getHomeDirectory() {
  return os.homedir();
}

function getDatabaseDirectory() {
  return path.join(getHomeDirectory(), '.secrethandshake', 'databases');
}

function getFilesDirectory() {
  return path.join(getHomeDirectory(), '.secrethandshake', 'files');
}

module.exports = {
  getHomeDirectory: getHomeDirectory,
  getDatabaseDirectory: getDatabaseDirectory,
  getFilesDirectory: getFilesDirectory
};