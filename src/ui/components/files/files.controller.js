'use strict';

(function (angular) {

  angular.module('sh.files')

  .controller('filesController', [
    '$scope', 
    '$rootScope',
    '$window', 
    '$timeout',
    'filesService', 
    
    function (
      $scope, 
      $rootScope,
      $window, 
      $timeout,
      filesService
    ) {
    
    $scope.files = filesService.files;
    $scope.moment = $window.moment;
    $scope.formatFileSize = filesService.formatBytes;
    
    $scope.droppedFiles = {};

    $scope.isSelected = false;
    $scope.isSearching = false;
    
    $scope.confirmModel = {
      show: false,
      text: 'Enter your passphrase',
      validate: filesService.checkPassphrase
    }

    // Private methods

    const ESCAPE_KEY = 27;

    function handleEscape($event) {
      if ($event.which === ESCAPE_KEY) {
        $scope.deselect();
        $scope.isSearching = false;
        $scope.confirmModel.show = false;
      }
    }

    function confirm() {
      return new Promise((resolve) => {
        $timeout(() => {
          $scope.confirmModel.show = true;
          $scope.confirmModel.done = resolve;
        });
      });
    }

    $window.document.addEventListener('keydown', handleEscape);

    // Scope methods

    $scope.select = (file) => {
      if ($scope.files.selected._id !== file._id) {
        $timeout(() => {
          $scope.files.selected = file;
          $scope.isSelected = true;
        });
      } else {
        $scope.deselect();
      }
    };

    $scope.deselect = () => {
      $timeout(() => {
        $scope.isSelected = false;
      });
      $timeout(() => {
        $scope.files.selected = {};
      }, 200);
    };

    $scope.consumeFiles = ($files) => {
      
      confirm()
        .then(() => {
          filesService.consumeFiles($files);
          $scope.droppedFiles = [];
        })
        .catch((error) => {
          // todo toast error
          console.error(error);
        });
    };

    // Scope watchers

    $rootScope.$watch('searchQuery', (sq) => {
      if (sq.q) {
        $scope.isSearching = true;
      } else {
        $scope.isSearching = false;
      }
    }, true);
  }]);

})(angular);