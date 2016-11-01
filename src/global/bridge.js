'use strict';

/**
 * Private
 */

function addScBridge(win) {
  if (win) {
    win.scbridge = win.scbridge || {};
  } else {
    throw new Error('Window not provided.');
  }
}

/**
 * Public
 */

function add(win, key, value) {
  
  addScBridge(win);

  if (!!win.scbridge[key]) {
    throw new Error('There is already a property named ' + key + ' in the bridge.');
  } else {
    win.scbridge[key] = value;
  }
}

module.exports = {
  add: add
};