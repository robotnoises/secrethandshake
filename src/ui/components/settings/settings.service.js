'use strict';

(function (angular) {

  angular.module('sh.settings')

  .factory('settingsService', [
    '$window', 
    '$timeout', 
    '$rootScope', 
    'messageService', 
  
    function (
      $window, 
      $timeout, 
      $rootScope, 
      messageService) {

      let settingsService = {};

      function checkPassphrase(input) {
        if ($window.shbridge && $window.shbridge.checkPassphrase) {
          return $window.shbridge.checkPassphrase(input); // returns Promise
        } else {
          throw new Error('Bridge method checkPassphrase not found');
        }
      }

      function setPassphrase(input) {
        if ($window.shbridge && $window.shbridge.setPassphrase) {
          return $window.shbridge.setPassphrase(input); // returns Promise
        } else {
          throw new Error('Bridge method setPassphrase not found');
        }
      }

      settingsService.checkPassphrase = checkPassphrase;
      settingsService.setPassphrase = setPassphrase;

      return settingsService;
    }
  ]);
})(angular);