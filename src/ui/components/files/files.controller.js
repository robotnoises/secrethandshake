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
    
    $scope.isSelected = false;
    $scope.isClicked = false;
    $scope.isSearching = false;
    
    $scope.confirmModel = {
      text: 'Enter your passphrase',
      eventName: 'toggleFileConfirm',
      validate: filesService.checkPassphrase
    }

    $scope.clickPosition = {
      x: '0px',
      y: '0px'
    }

    // Private methods

    const ESCAPE_KEY = 27;

    function handleEscape($event) {
      if ($event.which === ESCAPE_KEY) {
        $scope.deselect();
        $scope.isSearching = false;
        $rootScope.$emit($scope.confirmModel.eventName, false);
      }
    }

    function handleConfirm(files, isConfirmed) {
      if (isConfirmed) {
        filesService.consumeFiles(files);
      } else {
        // todo: reset?
      }
    }

    function confirm() {
      return new Promise(resolve => {
        $rootScope.$emit($scope.confirmModel.eventName, {
          show: true,
          callback: resolve
        });
      });
    }

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
        filesService.deselect();
      }, 200);
    };

    $scope.consumeFiles = ($files) => {
      if (!$files.length) return;
      confirm()
        .then(handleConfirm.bind(undefined, $files))
        .catch(error => console.error(error));
    };

    $scope.toggleContextMenu = (file) => {
      $timeout(() => {
        $scope.clickPosition = $window.$shclickposition;
        $scope.files.clicked = file || {};
        $scope.isClicked = !!file;
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

    $scope.$watch('files.selected', (selectedFile) => {
      $scope.isSelected = Object.keys(selectedFile).length > 0;
    }, true);

    // Event listeners

    $window.document.addEventListener('keydown', handleEscape);

    $window.addEventListener('mousedown', ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.toggleContextMenu();
    });

  }]);

})(angular);