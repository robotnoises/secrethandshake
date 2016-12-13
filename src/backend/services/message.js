'use strict';

const logger = require('./logger');

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

function Notification(type, value) {
  if (!!type && !!value) {
    this.type = type;
    this.value = value;
  } else {
    throw new Error('type and value must be defined');
  }
}

module.exports = {
  send: send,
  Notification: Notification
};

