'use strict';

(function (angular) {

  angular.module('sh.settings')

  .controller('settingsController', [
    '$scope', 
    'settingsService', 
    
    function (
      $scope, 
      settingsService) {

      // Settings Form object
      $scope.settings = {};

      // Scope methods

      $scope.setPassphrase = settingsService.setPassphrase;
    }
  ]);
})(angular);