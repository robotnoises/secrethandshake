'use strict';

/**
 * Private
 */

function addShBridge(win) {
  if (win) {
    win.shbridge = win.shbridge || {};
  } else {
    throw new Error('Window not provided.');
  }
}

/**
 * Public
 */

function add(win, key, value) {
  
  addShBridge(win);

  if (!!win.shbridge[key]) {
    throw new Error('There is already a property named ' + key + ' in the bridge.');
  } else {
    win.shbridge[key] = value;
  }
}

module.exports = {
  add: add
};