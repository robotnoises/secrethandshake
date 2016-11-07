'use strict';

const logger = require('./logger');

/**
 * Private
 */

let shbridge = {};

function addShBridge(win) {
  if (win) {
    shbridge = win.shbridge = win.shbridge || {};
  } else {
    throw new Error('Window not provided.');
  }
}

/**
 * Public
 */

function addItem(win, key, value) {
  
  addShBridge(win);

  if (!!win.shbridge[key]) {
    throw new Error('There is already a property named ' + key + ' in the bridge.');
  } else {
    shbridge[key] = value;
  }
}

module.exports = {
  get: shbridge,
  addItem: addItem
};