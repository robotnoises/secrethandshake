'use strict';

const path = require('path'); 
const testWindow = require('./../windows/test');
const filesWindow = require('./../windows/files');

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
      label: 'Open Secret Handshake', 
      click: filesWindow.show
    }));

    // Test harness application
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'Test App', 
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
      icon: 'src/assets/images/tray2.png'
    });
    _tray.tooltip = 'shhh';
    createMenu();
  }
}

module.exports = {
  create: create
};