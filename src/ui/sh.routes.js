'use strict';

(function (angular) {

  angular.module('sh')
  
  .config(['$routeProvider', function ($routeProvider) {
    
    // files
    $routeProvider.when('/', {
      controller: 'filesController',
      templateUrl: 'components/files/files.html',
      active: 'files'
    });

    // settings
    $routeProvider.when('/messages', {
      controller: 'settingsController',
      templateUrl: 'components/settings/settings.html',
      active: 'messages'
    });

    // settings
    $routeProvider.when('/contacts', {
      controller: 'settingsController',
      templateUrl: 'components/settings/settings.html',
      active: 'contacts'
    });

    // settings
    $routeProvider.when('/audit', {
      controller: 'settingsController',
      templateUrl: 'components/settings/settings.html',
      active: 'audit'
    });

    // settings
    $routeProvider.when('/settings', {
      controller: 'settingsController',
      templateUrl: 'components/settings/settings.html',
      active: 'settings'
    });

  }]);

})(angular);