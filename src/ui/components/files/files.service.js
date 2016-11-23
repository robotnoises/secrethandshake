'use strict';

(function (angular) {

  angular.module('sh.files')

  .factory('filesService', ['$window', function ($window) {

    let filesService= {};

    // let containerId;

    filesService.files = ($window.shbridge) ? $window.shbridge.files : [
      { id: 0, name: 'foo.txt', updated: new Date('11/03/2016') },
      { id: 1, name: 'bar.txt', updated: new Date('12/01/2015') },
      { id: 2, name: 'baz.txt', updated: new Date('09/19/2016') },
      { id: 3, name: 'fart.docx', updated: new Date('10/11/2016') },
      { id: 4, name: 'cool document.xslx', updated: new Date('10/30/2016') },
      { id: 5, name: 'aaaaaaaa.pptx', updated: new Date('08/03/2016') },
      { id: 6, name: 'manifesto.txt', updated: new Date('07/04/2016') }
    ];

    return filesService;
  }]);

})(angular);