'use strict';

(function (angular) {

  angular.module('sh')

  .controller('navController', ['$scope', '$route', function ($scope, $route) {
    $scope.$route = $route;
  }]);

})(angular);