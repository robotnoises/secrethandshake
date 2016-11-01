'use strict';

/**
 * Private
 */

function Options(optionOverrides) {
  this.title = optionOverrides.title || 'Secret Handshake';
  this.height = optionOverrides.height || 500;
  this.width = optionOverrides.width || 400;
}

/**
 * Public
 */

function create(pathToWindow, options, callback) {
  nw.Window.open(pathToWindow, new Options(options), callback);
}

module.exports = {
  create: create
};