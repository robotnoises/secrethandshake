'use strict';

(function (angular) {

  angular.module('sh.files')

  .directive('fileDetails', ['filesService', function (filesService) {
    return {
      restrict: 'E',
      scope: {
        file: '=file'
      },
      link: (scope, element, attributes) => {
        scope.open = filesService.openFile;
        scope.encrypt = filesService.encryptFile;
      }, 
      template: 
      '<div class="container-file-details">' +
      '  <h1 ng-bind="file.name"></h1>' + 
      '  <button class="btn" ng-click="open(file)">Open</button>' + 
      '  <button class="btn" ng-if="file.state === 1" ng-click="encrypt(file)">Encrypt</button>' + 
      '</div>' 
    }
  }]);

})(angular);