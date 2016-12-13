'use strict';

(function (angular) {

  angular.module('sh')

  .directive('rightClick', ['$timeout', '$window', '$rootScope', '$parse', 
  
  function ($timeout, $window, $rootScope, $parse) {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: (scope, element, attributes) => {
        
        // Right-click listener
        element[0].addEventListener('mousedown', ($event) => {
          $event.preventDefault();
          $event.stopPropagation();

          if ($event.which === 3) {
            try {
              $parse(attributes.rightClick)(scope);
            } catch (ex) {
              console.error(ex);
            }
          }
        });
      }
    }
  }]);

})(angular);