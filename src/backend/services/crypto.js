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
 * Public
 */

function encypt(pathToFile, passphrase) {
  let key = to64(passphrase);
  let cipher = crypto.createCipher('aes-256-cbc', key);
  let input = fs.createReadStream(pathToFile);
  let output = fs.createWriteStream(pathToFile + '.enc');

  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on('finish', resolve);
    output.on('error', reject.bind(this, error));
  });
}

module.exports = {
  encypt: encypt
};