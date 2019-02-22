(function () {
  'use strict';

  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/admin.template.html',
    bindings: {
      items: '<',
        }
  });

})();
