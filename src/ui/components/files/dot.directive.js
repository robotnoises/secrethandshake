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
        scope.stateClass = 'loading';

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
              break;
            case STATE.DECRYPTED:
              scope.stateClass = 'decrypted';
              break;
            case STATE.PROCESSING:
              scope.stateClass = 'processing';
              break;
            case STATE.PENDING:
              scope.stateClass = 'pending';
              break;
            case STATE.ERROR:
              scope.stateClass = 'error';
              break;
            default:
              scope.stateClass = 'error';
              break;
          }
        }

        scope.$watch('state', (state) => {
          $timeout(setState.bind(undefined, state));
        });
      }, 
      template: 
      '<div class="dot-container" ng-class="stateClass">' +
      '  <div class="dot">' +
      '  </div>' +
      '</div>' 
    }
  }]);

})(angular);