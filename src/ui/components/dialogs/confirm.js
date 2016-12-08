'use strict';

(function (angular) {

  angular.module('sh')

  .directive('confirmDirective', ['$timeout', '$window', function ($timeout, $window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=model'
      },
      link: (scope, element, attributes) => {
        
        const ENTER_KEY = 13;

        // Private 

        function close() {
          $timeout(() => {
            scope.model.show = false;
            scope.form = {};
          });
        }

        // Scope

        scope.form = {
          passphrase: ''
        };
        
        scope.nope = ($event) => {
          $event.preventDefault();
          $event.stopPropagation();
        };

        scope.cancel = () => {
          scope.model.done(false);
          close();
        };

        scope.$watch('model.show', (show) => {
          if (show) {
            $timeout(() => {
              let input = angular.element(document.querySelectorAll('#passphrase'))[0];
              input.focus();
            });
          } else {
            scope.form.passphrase = '';
          }
        });

        element[0].addEventListener('keydown', ($event) => {
          if ($event.which === ENTER_KEY && scope.form.passphrase) {
            scope.model.validate(scope.form.passphrase)
              .then(isValid => {
                if (isValid) {
                  scope.model.done(true);
                  close();
                } else {
                  // todo: wiggle
                }
              })
              .catch(error => {
                // todo: toast
                console.error(error);
              });
          }
        });
      }, 
      template: 
      '<div class="confirm-container" ng-class="{ show: model.show }" ng-click="cancel()">' +
      '  <div class="confirm" ng-click="nope($event)">' +
      '    <input id="passphrase" type="password" ng-model="form.passphrase" placeholder="{{model.text}}" onfocus="this.removeAttribute(\'readonly\');" readonly />' + 
      '  </div>' + 
      '</div>' 
    }
  }]);

})(angular);