'use strict';

const path = require('path');
const windowService = require('./../../ui/services/windowService');
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
      label: 'foo', 
      click: () => {
        
        let tempPath = path.join('src', 'ui', 'components', 'home', 'home.html');

        windowService.create(tempPath, { show: false }, (win) => {
          win.on('loaded', () => {
            win.show();
          });

          bridge.add(win.window, 'foo', 'bar');
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
    _tray = new nw.Tray({ title: 'foo' });
    _tray.tooltip = 'shhh';
    createMenu();
  }
}

function show() {
  // todo
}

module.exports = {
  create: create,
  show: show
};