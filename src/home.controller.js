(function () {
  'use strict';
  angular.module('GJApp')
  .controller('HomeController', HomeController);
  HomeController.$inject = ['FData', '$state', '$scope', '$http', 'isloggedin', '$log', 'Upload', '$sce'];
    function HomeController(FData, $state, $scope, $http, isloggedin, $log, Upload, $sce) {
        var hCtrl = this;
        //**************** Data for Dbase Upload ********************//
        $scope.fD = FData;
        $scope.fElements = {};
        $scope.onFileSelect = function(file) {
            $scope.message = "";
                $scope.upload = Upload.upload({
                    url: 'php/upload.php',
                    method: 'POST',
                    file: file,
                    data: {
                              'item': $scope.fElements
                          }
                }).success(function(data, status, headers, config) {
                    $scope.message = data;
                }).error(function(data, status) {
                    $scope.message = data;
                });
        };
        //****************** MODAL ****************//
        hCtrl.data = false;
          hCtrl.open = function () {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'src/template/myModalContent.html',
              controller: 'ModalInstanceController',
              controllerAs: 'mCtrl',
              resolve: {
                data: function () {
                  return hCtrl.data;
                }
              }
            });
            modalInstance.result.then(function () {
              $scope.showLogin = false;
              $scope.hasRoleAdmin = true;
            });
          };
        //*****************************************//
        $scope.hasRoleAdmin = false;
        hCtrl.isloggedin = isloggedin;
        if (hCtrl.isloggedin[1].Role != null) {
          $scope.hasRoleAdmin = true;
        } else {
          $scope.hasRoleAdmin = false;
        }
        if (hCtrl.isloggedin[0].isIn === false) {
          $scope.showLogin = true;
          $scope.showRegister = true;
          hCtrl.data = false;
          if (isloggedin[1].items === null) {
            $scope.showCart = false;
          } else {
            $scope.showCart = true;
          }
        } else {
          $scope.showLogin = false;
          $scope.showRegister = false;
          hCtrl.data = true;
          if (isloggedin[1].items === null) {
            $scope.showCart = false;
          } else {
            $scope.showCart = true;
          }
        }
        $scope.showLoginForm = false;
        $scope.loginWarning = "";
//**********************************************************//
        $scope.logoutForm = function() {
          var userparams = "logOut";
          $http({
                  method  : 'POST',
                  url     : 'php/logoutsubmit.php',
                  data    : userparams,
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'},
                   })
                .then(function(response) {
                  if (response.data.isloggedin[0].isIn === false) {
                    $scope.showLogin = true;
                    $scope.hasRoleAdmin = false;
                  }
                    return response.data;
                  });
        };
// ***************************************** //
          $scope.openloginForm = function() {
            if (!($scope.showLoginForm)) {
              $scope.pwarnings = "";
              $scope.loginWarning = "";
              $scope.showLoginForm = true;
              $scope.showRegisterForm = false;
              $scope.showPasswordChange = false;
              $scope.showPasswordForm = false;
            }
          };
          $scope.closeloginForm = function() {
            if ($scope.showLoginForm) {
              $scope.loginWarning = "";
              $scope.showLoginForm = false;
              $scope.showPasswordForm = false;
              $scope.showPasswordChange = false;
            }
          };
          $scope.closeregisterForm = function() {
            if ($scope.showRegisterForm) {
              $scope.loginWarning = "";
              $scope.showRegisterForm = false;
              $scope.showPasswordForm = false;
              $scope.showPasswordChange = false;
            }
          };
};
})();
