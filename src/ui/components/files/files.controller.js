'use strict';

(function (angular) {

  angular.module('sh.files')

  .controller('filesController', [
    '$scope', 
    '$window', 
    '$timeout',
    'filesService', 
    
    function (
      $scope, 
      $window, 
      $timeout,
      filesService
    ) {
    
    $scope.files = filesService.files;
    $scope.moment = $window.moment;
    $scope.formatFileSize = filesService.formatBytes;
    $scope.droppedFiles = {};
    $scope.selectedFile = {};
    $scope.isSelected = false;

    // Private methods

    const ESCAPE_KEY = 27;

    function handleEscape($event) {
      if ($event.which === ESCAPE_KEY) {
        $scope.deselect();
      }
    }

    $window.document.addEventListener('keydown', handleEscape);

    // Scope methods

    $scope.select = (file) => {
      if ($scope.selectedFile._id !== file._id) {
        $scope.selectedFile = file;
        $scope.isSelected = true;
      } else {
        $scope.deselect();
      }
    };

    $scope.deselect = () => {
      $timeout(() => {
        $scope.isSelected = false;
      });
      $timeout(() => {
        $scope.selectedFile = {};
      }, 200);
    };

    $scope.consumeFiles = ($files) => {
      filesService.consumeFiles($files);
      $scope.droppedFiles = [];
    };
  }]);

})(angular);