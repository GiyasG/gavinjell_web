(function () {
'use strict';
angular.module('GJApp')
.config(RoutesConfig);
RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  var home = {
    name: 'home',
    url: '/',
        views: {
          'content@': {
            templateUrl: 'src/template/home.template.html',
            controller: 'HomeController as hCtrl',
              resolve: {
                isloggedin: function (DataService) {
                  return DataService.isLoggedIn('home');
                  }
              }
          },
          'navbar@': {
            templateUrl: 'src/template/navbar.template.html',
            controller: 'NavbarController as nCtrl',
              resolve: {
                isloggedin: function (DataService) {
                  return DataService.isLoggedIn('home');
                  }
              }
          },
        }
    }

  var projects = {
    name: 'projects',
    url:'projects',
    parent: 'home',
    views: {
        'content@': {
          templateUrl: 'src/template/projects.template.html',
          controller: 'ProjectsController as projectsCtrl',
          resolve: {
            items: function (DataService) {
              return DataService.getItems('projects');
            }
    }
   }
  }
}
  var papers = {
    name: 'papers',
    url:'papers',
    parent: 'home',
    views: {
        'content@': {
          templateUrl: 'src/template/papers.template.html',
          controller: 'PapersController as papersCtrl',
          resolve: {
            items: function (DataService) {
              return DataService.getItems('papers');
            }
          }
    }
   }
  }

  var teams = {
    name: 'teams',
    url:'teams',
    parent: 'home',
    views: {
        'content@': {
          templateUrl: 'src/template/teams.template.html',
          controller: 'TeamsController as teamsCtrl',
          resolve: {
            items: function (DataService) {
              return DataService.getItems('teams');
            }
      }
    }
   }
  }
  var emailconfirmed = {
    name: 'verifyemail',
    parent: 'home',
    url: 'verifyemail/{selector}/{token}',
    views: {
         'verifyemail@home': {
          templateUrl: 'src/template/verify.template.html',
          controller: 'VerifyController as vCtrl'
        }
      },
      resolve: {
              info: function(DataService, $stateParams) {
                    return DataService.VerifyEmail($stateParams.selector, $stateParams.token);
                  }
                }
  }
  var passwordconfirmed = {
    name: 'changepassword',
    parent: 'home',
    url: 'changepassword/{selector}/{token}',
    views: {
         'changepassword@home': {
          templateUrl: 'src/template/passwordchange.template.html',
          controller: 'ChangepasswordController as cpCtrl'
        }
      },
      resolve: {
              info: function(DataService, $stateParams) {
                    return DataService.resetPassword($stateParams.selector, $stateParams.token);
                  }
                }
  }

var admin = {
    name: 'admin',
    parent: 'home',
    url: 'admin',
    views: {
         'content@': {
          templateUrl: 'src/template/admin.template.html',
          controller: 'AdminController as aCtrl',
        }
      },
      resolve: {
        items: ['DataService', function (DataService) {
          return DataService.getItems('admin');
        }]
      }
  }

  var project = {
    name: 'project',
    parent: 'home',
    params: { id: null },
    views: {
         'content@': {
          templateUrl: 'src/template/project.template.html',
          controller: 'ProjectController as psCtrl',
        }
      },
      resolve: {
        items: function (DataService, $stateParams) {
          return DataService.getItems('projects', $stateParams.id);
        }
      }
  }

  var paper = {
    name: 'paper',
    parent: 'home',
    params: { id: null },
    views: {
         'content@': {
          templateUrl: 'src/template/paper.template.html',
          controller: 'PaperController as rsCtrl',
        }
      },
      resolve: {
        items: function (DataService, $stateParams) {
          return DataService.getItems('papers', $stateParams.id);
        }
      }
  }

  var team = {
    name: 'team',
    parent: 'home',
    params: { id: null },
    views: {
         'content@': {
          templateUrl: 'src/template/team.template.html',
          controller: 'TeamController as tsCtrl',
        }
      },
      resolve: {
        items: function (DataService, $stateParams) {
          return DataService.getItems('teams', $stateParams.id);
        }
      }
  }
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state(home)
  .state(projects)
  .state(papers)
  .state(teams)
  .state(emailconfirmed)
  .state(passwordconfirmed)
  .state(admin)
  .state(project)
  .state(paper)
  .state(team)
 }
})();
