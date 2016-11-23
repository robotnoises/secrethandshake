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
      ' <p ng-bind="file.name"></p>' + 
      '</div>' 
    }
  });

})(angular);