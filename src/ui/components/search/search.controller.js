'use strict';

(function (angular) {

  angular.module('sh')

  .controller('searchController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    // $scope.search = {
    //   q: '',
    //   location: 'files'
    // };

    $rootScope.searchQuery = {
      q: '',
      location: 'files'
    };

    // $scope.$watch('query', (q) => {
    //   console.log(q);
    // });

    // $rootScope.searchQuery = $scope.query;
  }]);

})(angular);