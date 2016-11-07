'use strict';

const crypto = require('crypto');
const fs = require('fs');

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
 * @params: pathToFile: string, passphrase: string, decipher: boolean
 */ 
function translate(pathToFile, passphrase, suffix, decipher) {
  let key = to64(passphrase);
  let algo = (decipher) ? crypto.createDecipher('aes-256-cbc', key) : crypto.createCipher('aes-256-cbc', key);
  let input = fs.createReadStream(pathToFile);
  let output = fs.createWriteStream(pathToFile.split('.enc')[0] + suffix);

  input.pipe(algo).pipe(output);

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    output.on('error', error => reject(error));
  });
}

function test(pathToFile, pathToEncFile, passphrase) {

}

/**
 * Public
 */

// encrypt a file
function encrypt(pathToFile, passphrase) {
  return translate(pathToFile, passphrase, '.enc');
}

// decipher a file
function decrypt(pathToEncFile, passphrase) {
  return translate(pathToEncFile, passphrase, '.dec', true);
}


// test, an encrypted file, then clean-up unencrypted files
function clean() {

}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};