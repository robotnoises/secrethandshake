'use strict';

(function (angular) {

  angular.module('sh')

  .directive('searchDetails', function () {
    return {
      restrict: 'E',
      scope: {
        query: '=query'
      },
      link: (scope, element, attributes) => {
        // todo
      }, 
      template: 
      '<div class="container-search-details">' +
      '  <div>' +
      '    <p>Searching {{query.location}}... {{query.q}}</p>' + 
      '  </div>' + 
      '</div>' 
    }
  });

})(angular);