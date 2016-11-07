'use strict';

const path = require('path'); 
const testWindow = require('./../windows/test');

/**
 * Globals
 */

let _tray;
let _menu;

/**
 * Private
 */

function createMenu() {
  if (!_menu && _tray) {
    _menu = new nw.Menu();
    
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'test', 
      click: testWindow.show
    }));

    _tray.menu = _menu;
  }
}

/**
 * Public
 */

function create() {
  // Create a tray icon
  if (!_tray) {
    _tray = new nw.Tray({
      icon: 'src/assets/images/tray2.png'
    });
    _tray.tooltip = 'shhh';
    createMenu();
  }
}

module.exports = {
  create: create
};