'use strict';

const logger = require('./../../global/logger');

/**
 * notifications should take the form...
 * 
 * {
 *   type: (string),
 *   value: (string)
 * }
 */

function send(win, notification) {
  if (!!win && !!notification) {
    win.postMessage(notification, '*');
  }
}

function listenFor(win, event, recieveHandler) {
  // todo
}

module.exports = {
  send: send,
  listenFor: listenFor
};

