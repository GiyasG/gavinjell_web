(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/projects.template.html',
    bindings: {
      items: '<'
        }
  });
})();
