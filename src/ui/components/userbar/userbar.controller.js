'use strict';

(function (angular) {

  angular.module('sh')

  .controller('userbarController', ['$scope', function ($scope) {
    $scope.isHovered = false;
    $scope.toggleHover = (force) => {
      $scope.isHovered = (force === typeof 'boolean') ? force : !$scope.isHovered;
    };
  }]);

})(angular);