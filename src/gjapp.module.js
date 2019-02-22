(function () {
'use strict'
angular.module('GJApp', ['ui.router', 'data', 'ui.bootstrap', 'ngFileUpload', 'ui.tinymce','ngSanitize'])
.config(config);
config.$inject = ['$httpProvider', '$sceDelegateProvider'];
function config($httpProvider, $sceDelegateProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://gavinjell.ga/php/**',
    'http://e.freewebhostingarea.com/**'
  ]);
}
})();
