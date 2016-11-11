'use strict';

(function (angular) {

  angular.module('sh')
  
  .config(['$routeProvider', function ($routeProvider) {
    
    // files
    $routeProvider.when('/', {
      controller: 'filesController',
      templateUrl: 'components/files/files.html'
    });

    // settings
    $routeProvider.when('/settings', {
      controller: 'settingsController',
      templateUrl: 'components/settings/settings.html'
    });

  }]);

})(angular);