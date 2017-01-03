'use strict';

(function (angular) {

  angular.module('sh.files')

  .factory('notificationService', ['$rootScope', ($rootScope) => {

    let notificationService = {};

    // Private

    function notify(notification) {
      $rootScope.$emit('notify', notification);
    }

    function Notification (message, title, level) {
      this.message = message;
      this.title = title;
      this.level = level;
    }

    // Public

    function sendInfo(message, title) {
      let t = title || '';
      notify(new Notification(message, t, 'info'));
    }

    function sendSuccess(message, title) {
      let t = title || '';
      notify(new Notification(message, t, 'success'));
    }

    function sendWarning(message, title) {
      let t = title || '';
      notify(new Notification(message, t, 'warning'));
    }

    function sendError(message, title) {
      let t = title || '';
      notify(new Notification(message, t, 'error'));
    }

    notificationService.sendInfo = sendInfo;
    notificationService.sendSuccess = sendSuccess;
    notificationService.sendWarning = sendWarning;
    notificationService.sendError = sendError;

    return notificationService;
  }])

})(angular);