(function () {
  'use strict';
  angular.module('GJApp')
  .component('verify', {
    templateUrl: 'src/template/verify.template.html',
    bindings: {
      info: '<'
        }
  });
})();
