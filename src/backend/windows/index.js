'use strict';

/**
 * Private
 */

function Options(optionOverrides) {
  this.title = ' ';
  this.height = optionOverrides.height || 700;
  this.width = optionOverrides.width || 900;
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