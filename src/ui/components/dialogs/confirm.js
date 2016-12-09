'use strict';

(function (angular) {

  angular.module('sh')

  .directive('confirmDirective', ['$timeout', '$window', '$rootScope', function ($timeout, $window, $rootScope) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=model'
      },
      link: (scope, element, attributes) => {
        
        const ENTER_KEY = 13;

        // Private 

        function show(data) {
          angular.element(document.querySelectorAll('#passphrase'))[0].focus();
          scope.show = (typeof force === 'boolean') ? data.show : !scope.show;
          scope.callback = data.callback;
        }

        function hide() {
          $timeout(() => {
            scope.show = false;
            scope.invalid = false;
            scope.form.passphrase = '';
          });
        }

        // Scope

        scope.show = false;
        scope.invalid = false;

        scope.form = {
          passphrase: ''
        };
        
        scope.nope = ($event) => {
          $event.preventDefault();
          $event.stopPropagation();
        };

        scope.cancel = () => {
          scope.callback(false);
          hide();
        };

        if (scope.model.eventName) {
          $rootScope.$on(scope.model.eventName, ($event, data) => $timeout(show.bind(undefined, data)));
        }
        
        // Events

        element[0].addEventListener('keydown', ($event) => {
          $timeout(() => scope.invalid = false);
          if ($event.which === ENTER_KEY && scope.form.passphrase) {
            scope.model.validate(scope.form.passphrase)
              .then(isValid => {
                if (isValid) {
                  scope.callback(true);
                  hide();
                } else {
                  $timeout(() => scope.invalid = true);
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
      '<div class="confirm-container" ng-class="{ show: show }" ng-click="cancel()">' +
      '  <div class="confirm" ng-click="nope($event)" ng-class="{ invalid: invalid }">' +
      '    <input id="passphrase" type="password" ng-model="form.passphrase" placeholder="{{model.text}}" onfocus="this.removeAttribute(\'readonly\');" readonly autocomplete="false" />' + 
      '  </div>' + 
      '</div>' 
    }
  }]);

})(angular);