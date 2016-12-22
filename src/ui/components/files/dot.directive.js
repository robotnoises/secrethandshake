'use strict';

(function (angular) {

  angular.module('sh.files')

  .directive('dot', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        state: '=state'
      },
      link: (scope, element, attributes) => {
        scope.stateClass = '';
        scope.processing = false;

        const STATE = {
          ENCRYPTED: 0,
          DECRYPTED: 1,
          PROCESSING: 2,
          PENDING: 3,
          ERROR: 4
        };

        function setState(state) {
          switch(state) {
            case STATE.ENCRYPTED:
              scope.stateClass = 'encrypted';
              scope.processing = false;
              break;
            case STATE.DECRYPTED:
              scope.stateClass = 'decrypted';
              scope.processing = false;
              break;
            case STATE.PROCESSING:
              scope.stateClass = 'processing';
              scope.processing = true;
              break;
            case STATE.PENDING:
              scope.stateClass = 'pending';
              scope.processing = false;
              break;
            case STATE.ERROR:
              scope.stateClass = 'error';
              scope.processing = false;
              break;
            default:
              scope.stateClass = 'error';
              scope.processing = false;
              break;
          }
        }

        scope.$watch('state', state => {
          $timeout(setState.bind(undefined, state));
        });
      }, 
      template: 
      '<div class="dot-container" ng-class="stateClass">' +
      '  <div ng-if="!processing" class="dot"></div>' + // <--- a bit of a hack to get around the animation "leaving behind"
      '  <div ng-if="processing" class="dot"></div>' +  // the old background-color state. We have to re-render each time.
      '</div>' 
    }
  }]);

})(angular);