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
        scope.delete = (file) => {
          filesService.deleteFile(file)
            .then(() => {
              filesService.deselect();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, 
      template: 
      '<div class="container-file-details">' +
      '  <div class="file-details-header">' +
      '    <h1 ng-bind="file.name"></h1>' + 
      '  </div>' +
      '  <div class="file-details-body">' +
      '    <button class="flat" ng-click="open(file)">Open</button>' + 
      '    <button class="flat" ng-disabled="file.state !== 1" ng-click="encrypt(file)">Encrypt</button>' +
      '    <button class="flat">Audit</button>' + 
      '    <button class="flat">Send</button>' + 
      '    <button class="flat">Export</button>' + 
      '    <button class="flat" ng-click="delete(file)">Delete</button>' + 
      '  </div>' + 
      '</div>' 
    }
  }]);

})(angular);