'use strict';

/**
 * Private
 */

function Options(optionOverrides) {
  this.title = ' ';
  this.height = optionOverrides.height || 700;
  this.width = optionOverrides.width || 900;
  this.frame = true;
  this.show = false;
  this.min_width = 350;
  // this.show_in_taskbar = false; // todo: this is a framework bug
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