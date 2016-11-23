'use strict';

(function (angular) {

  angular.module('sh.files')

  .controller('filesController', ['$scope', 'filesService', function ($scope, filesService) {
    $scope.files = filesService.files;
    $scope.selectedFile = {};
    $scope.isSelected = false;

    // Scope methods

    $scope.select = (file) => {
      if ($scope.selectedFile.id !== file.id) {
        $scope.selectedFile = file;
        $scope.isSelected = true;
      } else {
        $scope.deselect();
      }
    };

    $scope.deselect = () => {
      $scope.selectedFile = {};
      $scope.isSelected = false;
    };
  }]);

})(angular);