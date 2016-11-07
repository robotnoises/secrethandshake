'use strict';

const path = require('path');
const window = require('./window');
const bridge = require('./../../global/bridge'); 

/**
 * Globals
 */

let _tray;
let _menu;
let _initialized = false;

/**
 * Private
 */

function createMenu() {
  if (!_menu && _tray) {
    _menu = new nw.Menu();
    _menu.append(new nw.MenuItem({ 
      type: 'normal', 
      label: 'test', 
      click: () => {
        
        let tempPath = path.join('src', 'ui', 'components', 'test', 'test.html');

        window.create(tempPath, { show: false }, (win) => {
          win.on('loaded', () => {
            win.show();
          });

          bridge.addItem(win.window, 'setPassphraseTest', (passphrase) => {
            logger.info('Setting passphrase (test):', passphrase);
          });
        });
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
    _tray = new nw.Tray({ title: 'sh' });
    _tray.tooltip = 'shhh';
    createMenu();
  }
}

module.exports = {
  create: create
};