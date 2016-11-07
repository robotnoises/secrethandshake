'use strict';

const crypto = require('crypto');
const fs = require('fs');
const logger = require('./../../global/logger');

/**
 * Private
 */

// Lengthen input to 64 characters
function to64(input) {
  let lengthened = [];
  let offset = 0;
  let array = input.split('');
  let length = input.length;

  for (var i = 0; i < 64; i++) {
    if (i && i % length === 0) {
      offset++;
    }
    let index = 
    lengthened += array[(i + offset) % length];
  }

  return lengthened;
}

/**
 * translate();
 * 
 * Encrypt or decipher a file
 * 
 * @params: pathToFile: string, passphrase: string, suffix: string, decipher: boolean
 */ 
function translate(pathToFile, passphrase, suffix, decipher) {
  let key = to64(passphrase);
  let algo = (decipher) ? crypto.createDecipher('aes-256-cbc', key) : crypto.createCipher('aes-256-cbc', key);
  let input = fs.createReadStream(pathToFile);
  let output = fs.createWriteStream(pathToFile.split(/\.(dec|enc)\b/)[0] + suffix);

  input.pipe(algo).pipe(output);

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    output.on('error', error => reject(error));
  });
}

/**
 * getContentsSample();
 * 
 * read a small (chunkedLength) amount of data from a file, to be used to verify
 * that files can properly encrypt and decrypt
 */
function getContentsSample(pathToFile, maxCharsRead) {
  return new Promise((resolve, reject) => {
    let stream = fs.createReadStream(pathToFile);
    let chunked = '';
    
    stream.on('data', (chunk) => {
      if (chunked.length >= maxCharsRead) {
        chunked = chunked.substr(0, maxCharsRead);
        stream.close();
      } else {
        chunked += chunk;
      }
    });

    stream.on('close', () => resolve(chunked));
    stream.on('error', (error) => reject(error));
  });
}

function verify(pathToFile, passphrase) {
  return new Promise((resolve, reject) => {
    let pathToEncFile = pathToFile + '.enc';
    let pathToDecFile = pathToFile + '.dec';

    let origFileSample = '';

    translate(pathToEncFile, passphrase, '.dec', true)
      .then(() => {
        return getContentsSample(pathToFile, 1000);
      })
      .then((origSample) => {
        origFileSample = origSample;
        return getContentsSample(pathToDecFile, 1000);
      })
      .then((decryptedSample) => {
        resolve(decryptedSample === origFileSample)
      })
      .catch((error) => reject(error));
  });
}

function removeDecryptedFiles(pathToFile) {
  return new Promise((resolve, reject) => {    
    try {
      logger.info('Unlinking:', pathToFile + '.dec');
      fs.unlink(pathToFile + '.dec', () => {
        logger.info('Unlinking:', pathToFile);
        fs.unlink(pathToFile, () => resolve());
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

/**
 * Public
 */

// encrypt a file
function encrypt(pathToFile, passphrase) {
  return new Promise((resolve, reject) => {
    translate(pathToFile, passphrase, '.enc')
      .then(() => {
        return verify(pathToFile, passphrase);
      })
      .then((filesMatch) => {
        if (filesMatch) {
          return removeDecryptedFiles(pathToFile);
        } else {
          reject(new Error('Unable to verify encrypted files'));
        }
      })
      .then(() => resolve());
  });
}

// decipher a file
function decrypt(pathToEncFile, passphrase) {
  return translate(pathToEncFile, passphrase, '', true);
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};