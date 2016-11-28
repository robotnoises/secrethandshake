'use strict';

(function (angular) {

  angular.module('sh.files')

  .factory('filesService', ['$window', '$timeout', 'messageService', 
  
  function ($window, $timeout, messageService) {

    let filesService= {};

    // let containerId;

    filesService.files = {
      loaded: false,
      value: []
    };

    messageService.on('filesloaded', (value) => {
      $timeout(() => {
        filesService.files.loaded = true;
        filesService.files.value = value;
      });
    });

    return filesService;
  }]);

})(angular);