'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

function verifyDir(pathToDir) {
  if (!fs.existsSync(pathToDir)) {
    return fs.mkdirSync(pathToDir);
  } else {
    return;
  }
}

function getCommandLineOpenCommand() {
   switch (process.platform) { 
      case 'darwin' : return 'open';
      case 'win32' : return 'start';
      case 'win64' : return 'start';
      default : return 'xdg-open';
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

function openFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      let exec = require('child_process').exec;
      exec(getCommandLineOpenCommand() + ' "' + filePath + '"');
      resolve();
    } catch (ex) {
      reject(ex);
    }
  });
}

function removeFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(filePath, () => { // If it's unencrypted...
        fs.unlink(filePath + '.enc', resolve);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

module.exports = {
  getBaseDirectory: getBaseDirectory,
  getLogsDirectory: getLogsDirectory,
  getDatabaseDirectory: getDatabaseDirectory,
  getFilesDirectory: getFilesDirectory,
  moveToFiles: moveToFiles,
  openFile: openFile,
  removeFile: removeFile
};