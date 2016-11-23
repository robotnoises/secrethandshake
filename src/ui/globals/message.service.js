'use strict';

(function (angular) {

  angular.module('sh')

  .factory('messageService', ['$window', function ($window) {

    let messageService = {};
    let listeners = {};

    // Private methods

    function receiveMessage(notifcation) {
      for (var i = 0, max = listeners[notifcation.data.type].length; i < max; i++) {
        let callback = listeners[notifcation.data.type][i];
        callback(notifcation.data.value);
      }
    }

    $window.addEventListener("message", receiveMessage, false);

    // Public methods

    messageService.on = (eventType, callback) => {
      listeners[eventType] = listeners[eventType] || [];
      listeners[eventType].push(callback);
    };

    return messageService;
  }]);

})(angular);
