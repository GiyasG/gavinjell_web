(function () {
  'use strict';
  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/project.template.html',
    bindings: {
      items: '<'
        }
  });
})();
