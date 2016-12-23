'use strict';

(function (angular) {

  angular.module('sh')

  .controller('searchController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.searchQuery = {
      q: '',
      location: 'files'
    };
  }]);

})(angular);