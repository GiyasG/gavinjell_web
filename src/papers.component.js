(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/papers.template.html',
    bindings: {
      items: '<'
        }
  });
})();
