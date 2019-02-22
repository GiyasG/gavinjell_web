(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/teams.template.html',
    bindings: {
      items: '<'
        }
  });
})();
