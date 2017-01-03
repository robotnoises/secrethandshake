'use strict';

/**
 * note: a Toast object should take the form:
 * 
 * {
 *   title: 'a title',
 *   message: 'a message',
 *   level: 'success' // info, success, warning, error
 * }
 */

(function (angular) {

  angular.module('sh')

  .directive('toasts', ['$rootScope', '$timeout',
  
  function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      link: (scope, element, attributes) => {
        scope.toasts = {};

        function removeWhen(key, duration) {
          if (scope.toasts[key]) {
            $timeout(() => {
              delete scope.toasts[key];
            }, duration);
          }
        }

        $rootScope.$on('notify', ($event, data) => {
          data.key = new Date().getTime();
          scope.toasts[data.key] = data;
          removeWhen(data.key, 5000);
        });
      },
      template: 
        '<div class="toasts">' +
        '  <div class="toast" ng-class="toasts[key].level" ng-repeat="(key, value) in toasts">' +
        '    <div>{{toasts[key].message}}</div>' +
        '  </div>' +
        '</div>'
    }
  }]);

})(angular);