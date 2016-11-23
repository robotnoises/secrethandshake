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
    logger.info('Sending message:', notification.type);
    win.postMessage(notification, '*');
  }
}

module.exports = {
  send: send
};

