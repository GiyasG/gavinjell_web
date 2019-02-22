(function () {
  'use strict';
  angular.module('GJApp')
  .component('changepassword', {
    templateUrl: 'src/template/passwordchange.template.html',
    bindings: {
      info: '<'
        }
  });
})();
