'use strict';

(function (angular) {

  angular.module('sh.files')

  .factory('filesService', ['$window', '$timeout', 'messageService', 
  
  ($window, $timeout, messageService) => {

    let filesService = {};

    // Public

    filesService.files = {
      loaded: false,
      empty: true,
      working: {},
      complete: {},
      selected: {},
      clicked: {}
    };

    filesService.consumeFiles = (files) => {
      if ($window.shbridge && $window.shbridge.consumeFiles) {
        return $window.shbridge.consumeFiles(files);
      } else {
        console.error('Bridge method "consumeFiles" not found');
      }
    };

    filesService.openFile = (file) => {
      if ($window.shbridge && $window.shbridge.openFile) {
        return $window.shbridge.openFile(file);
      } else {
        console.error('Bridge method "openFile" not found');
      }
    };

    filesService.deleteFile = (file) => {
      if ($window.shbridge && $window.shbridge.deleteFile) {
        return $window.shbridge.deleteFile(file);
      } else {
        console.error('Bridge method "openFile" not found');
      }
    };

    filesService.deselect = () => {
      $timeout(() => {
        filesService.files.selected = {};
      });
    };

    filesService.encryptFile = (file, passphrase) => {
      if ($window.shbridge && $window.shbridge.reencryptFile) {
        return $window.shbridge.reencryptFile(file, 'foobarbaz'); // todo: accept a passphrase from User
      } else {
        console.error('Bridge method "reencryptFile" not found');
      }
    };

    filesService.checkPassphrase = (passphrase) => {
      if ($window.shbridge && $window.shbridge.checkPassphrase) {
        return $window.shbridge.checkPassphrase(passphrase);
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

    messageService.on('filesloaded', (files) => {
      $timeout(() => {
        filesService.files.complete = files;
        filesService.files.loaded = true;
        filesService.files.empty = Object.keys(files).length === 0;
      });
    });

    messageService.on('fileupdated', (file) => {
      $window.console.log('file updated:', file);
      
      let destination = (file.state > 2) ? 'working' : 'complete';

      $timeout(() => {
        filesService.files[destination][file.dropId] = file;
        filesService.files.selected = (filesService.files.selected._id && file._id === filesService.files.selected._id) ? file : filesService.files.selected;
      });
    });

    messageService.on('fileremoved', (file) => {
      $window.console.log('file removed:', file);
      
      let destination = (file.state > 2) ? 'working' : 'complete';

      $timeout(() => {
        delete filesService.files[destination][file.dropId];
      });
    });

    return filesService;
  }]);

})(angular);