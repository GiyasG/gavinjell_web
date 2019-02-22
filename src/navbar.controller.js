(function () {
  'use strict';
  angular.module('GJApp')
  .controller('NavbarController', NavbarController)
  .directive('sessionLogin', SessionLoginDirective)
  .directive('sessionRegister', SessionRegisterDirective)
  .directive('forgottenPassword', ForgottenPassordDirective);
  NavbarController.$inject = ['$state', '$http', '$scope', 'isloggedin', '$uibModal', '$log'];
    function NavbarController($state, $http, $scope, isloggedin, $uibModal, $log) {
        var nCtrl = this;
        $scope.hasRoleAdmin = false;
        nCtrl.isloggedin = isloggedin;
        if (nCtrl.isloggedin[1].Role != null) {
          $scope.hasRoleAdmin = true;
        } else {
          $scope.hasRoleAdmin = false;
        }
        if (nCtrl.isloggedin[0].isIn === false) {
          $scope.showLogin = true;
          $scope.showRegister = true;
          // nCtrl.data = false;
        } else {
          $scope.showLogin = false;
          $scope.showRegister = false;
          // nCtrl.data = true;
        }
        $scope.showLoginForm = false;
        $scope.loginWarning = "";
        //****************** MODAL ****************//
          nCtrl.open = function () {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'src/template/myModalContent.html',
              controller: 'ModalInstanceController',
              controllerAs: 'mCtrl',
              resolve: {
                data: function () {
                  return {
                    Role: "Admin"
                  };
                }
              }
            });
            modalInstance.result.then(function (data) {
              if (data) {
                $scope.hasRoleAdmin = true;
                $scope.showLogin = true;
              } else {
                $scope.showLogin = false;
                $scope.hasRoleAdmin = false;
              }
            });
          };
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
                    $state.go('home');
                  }
                    return response.data;
                  });
        };
// ***************************************** //
nCtrl.emptyCart = function () {
$http({
      method  : 'POST',
      url     : 'php/emptyCart.php'
       })
    .then(function(response) {
        nCtrl.isloggedin[1].items = response.data.cart;
        $scope.showCart = false;
        return response.data.cart;
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
    function SessionLoginDirective () {
      return {
        templateUrl: 'src/template/session-login.html'
      }
    };
    function SessionRegisterDirective () {
      return {
        templateUrl: 'src/template/session-register.html'
      }
    };
    function ForgottenPassordDirective () {
      return {
        templateUrl: 'src/template/forgotten-password.html'
      }
    };
})();
