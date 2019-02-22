(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/team.template.html',
    bindings: {
      items: '<'
        }
  });
})();
