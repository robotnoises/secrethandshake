'use strict';

(function (angular) {

  angular.module('sh.files')

  .directive('fileDetails', function () {
    return {
      restrict: 'E',
      scope: {
        file: '=file'
      },
      link: (scope, element, attributes) => {
        scope.hello = 'world';
      }, 
      template: 
      '<div class="container-file-details">' +
      '  <h1 ng-bind="file.name"></h1>' + 
      '</div>' 
    }
  });

})(angular);