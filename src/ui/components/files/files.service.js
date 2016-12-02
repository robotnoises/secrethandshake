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
    };

    filesService.formatBytes = (bytes) => {
      // Poached from: http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript#answer-18650828
      if (bytes == 0) return '0 Byte';
      let k = 1000; // or 1024 for binary
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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