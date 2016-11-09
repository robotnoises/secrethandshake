'use strict';

const bcrypt = require('bcryptjs');

/**
 * Private
 */

const saltRounds = 10;

/**
 * Public
 */

function hash(input) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(input, saltRounds, (err, hashed) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashed);
      }
    });
  });
}

function check(input, hashed) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(input, hashed, (err, hashed) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashed);
      }
    });
  });
}

module.exports = {
  hash: hash,
  check: check
};