'use strict';

const path = require('path'); 
const testWindow = require('./../windows/test');
const shWindow = require('./../windows/sh');

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

    // Main SH Window
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'Open', 
      click: shWindow.show
    }));

    // Test harness application
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'Test', 
      click: testWindow.show
    }));

    // Quit
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'Quit', 
      click: () => {
        nw.App.quit();
      }
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
      icon: 'src/assets/images/hand-spock-o.png'
    });
    _tray.tooltip = 'sh.';
    createMenu();
  }
}

module.exports = {
  create: create
};