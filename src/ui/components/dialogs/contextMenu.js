'use strict';

(function (angular) {

  angular.module('sh')

  .directive('contextMenu', ['filesService', 
  
  function (filesService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        file: '=clickedfile'
      },
      link: (scope, element, attributes) => {
        scope.open = filesService.openFile;
        scope.encrypt = filesService.encryptFile;
        scope.delete = filesService.deleteFile;

        scope.nope = ($event) => {
          $event.preventDefault();
          $event.stopPropagation();
        };
      },
      template: 
        '<div class="sh-contextmenu" ng-click="nope($event)">' +
        '  <div class="sh-contextmenu-item" ng-click="open(file)">Open</div>' +
        '  <div class="sh-contextmenu-item" ng-click="encrypt(file)">Encrypt</div>' +
        '  <div class="sh-contextmenu-item">Send</div>' +
        '  <div class="sh-contextmenu-item">Audit</div>' +
        '  <div class="sh-contextmenu-item">Export</div>' +
        '  <div class="sh-contextmenu-item" ng-click="delete(file)">Delete</div>' +
        '</div>'
    }
  }]);

})(angular);