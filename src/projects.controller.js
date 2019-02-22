(function () {
  'use strict';
  angular.module('GJApp')
  .controller('ProjectsController', ProjectsController);
  ProjectsController.$inject = ['items', '$http', '$sce', '$scope'];
  function ProjectsController(items, $http, $sce, $scope) {
    var projectsCtrl = this;
    projectsCtrl.items = items;
    $scope.hasRoleAdmin = projectsCtrl.items[5].AdminIsIn;
    $scope.isPrevious = {
    "background-color" : "lightblue"
   };
    $scope.isNext = {
      "background-color" : "lightblue"
    };
    projectsCtrl.totalPages = [];
    projectsCtrl.PagesProjects = [];
    for (var i = 1; i <= projectsCtrl.items[1].projects[0].length; i++) {
      projectsCtrl.totalPages.push(i);
    }
    projectsCtrl.sz = "";
    projectsCtrl.totalPagesNumber = projectsCtrl.totalPages.length;
    projectsCtrl.currentPage = 0;
    projectsCtrl.PagesProjects.push(projectsCtrl.items[1].projects[0][0]);
    window.scrollTo(0, 0);
    projectsCtrl.NextPage = function (pn) {
      if (parseInt(pn)<0) {
        pn =0;
      } else if (pn>projectsCtrl.totalPages.length-1) {
        pn =projectsCtrl.totalPages.length-1;
      } else {
        window.scrollTo(0, 0);
      }
      projectsCtrl.PagesProjects[0] = projectsCtrl.items[1].projects[0][pn];
      projectsCtrl.currentPage = pn;
    };
  }
})();
