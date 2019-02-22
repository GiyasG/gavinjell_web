(function () {
  'use strict';

  angular.module('GJApp')
  .controller('ChangepasswordController', ChangepasswordController);

  ChangepasswordController.$inject = ['$scope', '$http', '$stateParams', 'info'];
  function ChangepasswordController($scope, $http, $stateParams, info) {
    var cpCtrl = this;
    cpCtrl.info = info;
    $scope.user = {};
    $scope.loginWarningResend = "";
    $scope.showLoginForm = false;
    $scope.showPasswordChange = true;
    // ***************************************** //
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    $scope.passwordStrength = {
        "color": "grey",
        "margin-left": "5px",
        "margin-top": "5px",
        "font-size": "0.9em"
    };
    $scope.disabledChange = true;
    $scope.passwordMatch = false;
    $scope.passwordRegister = "Use at least one an uppercase letter, a number and a special character";
    $scope.analyze1 = function(value) {
      if (value) {
        if(strongRegex.test(value) & value.length >= 8) {
          $scope.passwordStrength["color"] = "green";
          $scope.passwordRegister = "Strong password";
        } else if(mediumRegex.test(value) & value.length >= 8) {
          $scope.passwordStrength["color"] = "orange";
          $scope.passwordRegister = "Fair password";
        } else {
          $scope.passwordStrength["color"] = "red";
          $scope.passwordRegister = "Not valid password, Use at least one an uppercase letter, a number and a special character";
        }
      } else {
        $scope.passwordStrength["color"] = "grey";
        $scope.passwordRegister = "Use at least one an uppercase letter, a number and a special character";
      }
    };
      $scope.analyze2 = function(value1, value2) {
        if (value1) {
          if(value1 == value2) {
            $scope.disabledChange = false;
            $scope.passwordMatch = true;
          } else {
            $scope.disabledChange = true;
            $scope.passwordMatch = false;
          }
        }
    };
// ***************************************** //
    $scope.changePassword = function() {
        var userparams =
          {
            sl: $stateParams.selector,
            tk: $stateParams.token,
            ps: $scope.user.new_password
          };
      $http({
              method  : 'POST',
              url     : 'php/changepassword.php',
              data    : userparams,
              headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
               })
            .then(function(response) {
                if (response.data.info[0].ConfirmationStatus) {
                  $scope.loginWarning = "";
                  $scope.showPasswordChange = false;
                  $scope.loginWarningResend = response.data.info[0].ConfirmationStatus;
                  $scope.user = {};
                } else {
                  $scope.loginWarning = "";
                  $scope.loginWarningResend = response.data.info[0].ConfirmationStatus;
                }
                return response.data.info;
            });
          };
  }
})();
