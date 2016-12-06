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

    filesService.encryptFile = (file, passphrase) => {
      if ($window.shbridge && $window.shbridge.reencryptFile) {
        $window.shbridge.reencryptFile(file, 'foobarbaz'); // todo: accept a passphrase from User
      } else {
        console.error('Bridge method "reencryptFile" not found');
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
      $window.console.log('file done:', file);
      $timeout(() => {
        let list = (file.state === 4) ? 'working' : 'complete';
        filesService.files[list].push(file);
      });
    });

    messageService.on('fileupdated', (value) => {
      $window.console.log('file updated:', value);

      // note: this is O(n), which is potentially not a big deal but needs to be looked into
      let list = (value.state === 4) ? 'working' : 'complete';
      let indexToBeReplaced = filesService.files[list].findIndex(file => file._id === value._id);

      $timeout(() => {
        if (indexToBeReplaced > -1) {
          filesService.files[list][indexToBeReplaced] = value;
        } else {
          filesService.files[list].push(value);
        }
      });
    });

    return filesService;
  }]);

})(angular);