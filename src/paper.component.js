(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/paper.template.html',
    bindings: {
      items: '<'
        }
  });
})();
