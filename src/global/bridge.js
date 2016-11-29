'use strict';

const logger = require('./logger');

let shbridge = null;

/**
 * Public
 */

function setItem(win, key, value) {
  if (!win || !win.shbridge) {
    win.shbridge = {};
    shbridge = win.shbridge;
  }
  logger.info('Setting bridge item:', key);
  shbridge[key] = value;
}

function getBridge() {
  return shbridge;
}

module.exports = {
  get: getBridge,
  setItem: setItem
};