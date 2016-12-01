'use strict';

(function (angular) {

  angular.module('sh.files')

  .factory('filesService', ['$window', '$timeout', 'messageService', 
  
  function ($window, $timeout, messageService) {

    let filesService= {};

    filesService.files = {
      loaded: false,
      working: [],
      complete: []
    };

    filesService.consumeFiles = (files) => {
      if ($window.shbridge && $window.shbridge.consumeFiles) {
        $window.shbridge.consumeFiles(files);
      } else {
        console.error('Bridge method "consumeFiles" not found');
      }
    };

    filesService.openFile = (file) => {
      if ($window.shbridge && $window.shbridge.openFile) {
        $window.shbridge.openFile(file);
      } else {
        console.error('Bridge method "openFile" not found');
      }
    }

    // Notification listeners

    messageService.on('filesloaded', (value) => {
      $timeout(() => {
        filesService.files.loaded = true;
        filesService.files.complete = value;
      });
    });

    messageService.on('filedone', (file) => {
      $window.console.log('filedone:', file);
      $timeout(() => {
        let list = (file.state === 4) ? 'working' : 'complete';
        filesService.files[list].push(file);
      });
    });

    messageService.on('fileupdated', (value) => {
      $window.console.log('update!', value);
    });

    return filesService;
  }]);

})(angular);