(function () {
  'use strict';
  angular.module('GJApp')
  .controller('PapersController', PapersController);
  PapersController.$inject = ['items', '$http', '$sce', '$scope'];
  function PapersController(items, $http, $sce, $scope) {
    var papersCtrl = this;
    papersCtrl.items = items;
    $scope.hasRoleAdmin = papersCtrl.items[5].AdminIsIn;
    $scope.isPrevious = {
    "background-color" : "lightblue"
   };
    $scope.isNext = {
      "background-color" : "lightblue"
    };
    papersCtrl.totalPages = [];
    papersCtrl.PagesPapers = [];
    for (var i = 1; i <= papersCtrl.items[2].papers[0].length; i++) {
      papersCtrl.totalPages.push(i);
    }
    papersCtrl.sz = "";
    papersCtrl.totalPagesNumber = papersCtrl.totalPages.length;
    papersCtrl.currentPage = 0;
    papersCtrl.PagesPapers.push(papersCtrl.items[2].papers[0][0]);
    window.scrollTo(0, 0);
    papersCtrl.NextPage = function (pn) {
      if (parseInt(pn)<0) {
        pn =0;
      } else if (pn>papersCtrl.totalPages.length-1) {
        pn =papersCtrl.totalPages.length-1;
      } else {
        window.scrollTo(0, 0);
      }
      papersCtrl.PagesPapers[0] = papersCtrl.items[2].papers[0][pn];
      papersCtrl.currentPage = pn;
    };
  }
})();
