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

    filesService.consumeFiles = (files) => {
      if ($window.shbridge && $window.shbridge.consumeFiles) {
        $window.shbridge.consumeFiles(files);
      } else {
        console.error('Bridge method "consumeFiles" not found');
      }
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