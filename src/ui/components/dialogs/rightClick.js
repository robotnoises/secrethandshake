'use strict';

(function (angular) {

  angular.module('sh')

  .directive('rightClick', ['$window', '$rootScope', '$parse', 
  
  function ($window, $rootScope, $parse) {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: (scope, element, attributes) => {
        
        // Right-click listener
        element[0].addEventListener('mousedown', ($event) => {
          if ($event.which === 3) {
            $event.preventDefault();
            $event.stopPropagation();
            
            $window.$shclickposition = {
              x: $event.clientX + 'px',
              y: $event.clientY + 'px'
            }

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