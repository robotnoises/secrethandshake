'use strict';

(function (angular) {

  angular.module('sh')

  .directive('contextMenu', ['$timeout', '$window', '$rootScope', 
  
  function ($timeout, $window, $rootScope) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        file: '=clickedfile'
      },
      link: (scope, element, attributes) => {
        // todo
      },
      template: 
        '<div class="sh-contextmenu">' +
        '  <div class="sh-contextmenu-item">Open</div>' +
        '  <div class="sh-contextmenu-item">Encrypt</div>' +
        '  <div class="sh-contextmenu-item">Send</div>' +
        '  <div class="sh-contextmenu-item">Audit</div>' +
        '  <div class="sh-contextmenu-item">Export</div>' +
        '  <div class="sh-contextmenu-item">Delete</div>' +
        '</div>'
    }
  }]);

})(angular);