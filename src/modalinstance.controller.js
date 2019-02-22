(function () {
  'use strict';
  angular.module('GJApp')
  .controller('ModalInstanceController', ModalInstanceController);
  ModalInstanceController.$inject = ['$uibModalInstance', 'data', '$scope', '$http'];
  function ModalInstanceController($uibModalInstance, data, $scope, $http) {
    var mCtrl = this;
        mCtrl.data = data;
        if ($scope.showLogin) {
          mCtrl.title = "You are already logged in";
        } else {
          mCtrl.title = "Loggining into account";
        }
        $scope.showModalLogin = true;
        $scope.showModalRegister = false;
        $scope.showModalForgotten = false;
        $scope.rms = {
          model: null,
          availableOptions: [
            {id: "1", Name: 'Remember (keep logged in)? — Yes'},
            {id: "2", Name: 'Remember (keep logged in)? — No'}
          ]
         };
        $scope.user = {};
// ***************************************** //
        $scope.showForgottenPassword = function(ev) {
          ev.preventDefault();
          mCtrl.title = "Sending request for forgotten password";
          $scope.showModalLogin = false;
          $scope.showModalForgotten = true;
          $scope.showModalRegister = false;
          $scope.loginWarning = "";
        };
// ***************************************** //
          $scope.openregisterForm = function(ev) {
            ev.preventDefault();
            mCtrl.title = "Registering a new account";
            $scope.showModalLogin = false;
            $scope.showModalForgotten = false;
            $scope.showModalRegister = true;
            $scope.loginWarning = "";
};
// ***************************************** //
            $scope.loginForm = function() {
              if (!$scope.user.em) {
                $scope.loginWarning = "invalid email format";
                return
              } else if (!$scope.user.ps) {
                $scope.loginWarning = "Please enter the password";
                return
              } else if (!$scope.rms.model) {
                $scope.loginWarning = "Please specify 'remember me' option";
                return
              }
              else {
                var regem = ($scope.user.em).replace(new RegExp('[.]', 'g'), '-dot-');
                var regps = ($scope.user.ps).replace(new RegExp('[.]', 'g'), '-dot-').replace(new RegExp('\\[', 'g'), '-sqbl-');
              }
                var userparams =
                {
                  em: regem,
                  ps: regps,
                  rm: $scope.rms.model
                };
              $http({
                      method  : 'POST',
                      url     : 'php/loginsubmit.php',
                      data    : userparams,
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                       })
                    .then(function(response) {
                        if (response.data.isloggedin[0].isLoggedIn == "1") {
                          $scope.showLoginForm = false;
                            if (response.data.isloggedin[0].Admin) {
                              mCtrl.role = true;
                            } else {
                              mCtrl.role = false;
                            }
                          $scope.user = {};
                          $uibModalInstance.close(mCtrl.role);
                        } else {
                          $scope.hasRoleAdmin = false;
                          $scope.showLogin = false;
                          $scope.loginWarning = response.data.isloggedin[0].Error;
                        }
                        return response.data.isloggedin;
                    });
                  };
// ***************************************** //
$scope.showRegisterForm = false;
$scope.ems = [
                {emid: 1, emName: 'Require email confirmation? — No'},
                {emid: 2, emName: 'Require email confirmation? — Yes'}
            ];
$scope.showPasswordForm = false;
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
$scope.passwordStrength = {
  "color": "grey",
  "margin-left": "5px",
  "margin-top": "5px",
  "font-size": "0.9em"
};
$scope.disabledRegister = true;
$scope.passwordRegister = "Use at least one an uppercase letter, a number and a special character";
$scope.analyze = function(value) {
if (value) {
  if(strongRegex.test(value) & value.length >= 8) {
    $scope.passwordStrength["color"] = "green";
    $scope.disabledRegister = false;
    $scope.passwordRegister = "Strong password";
  } else if(mediumRegex.test(value) & value.length >= 8) {
    $scope.passwordStrength["color"] = "orange";
    $scope.disabledRegister = false;
    $scope.passwordRegister = "Fair password";
  } else {
    $scope.passwordStrength["color"] = "red";
    $scope.disabledRegister = true;
    $scope.passwordRegister = "Not valid password, Use at least one an uppercase letter, a number and a special character";
  }
} else {
  $scope.passwordStrength["color"] = "grey";
  $scope.passwordRegister = "Use at least one an uppercase letter, a number and a special character";
}
};
// ***************************************** //
$scope.registerForm = function() {
  if (!$scope.user.em) {
    $scope.loginWarning = "invalid email format";
    return
  } else if (!$scope.user.ps) {
    $scope.loginWarning = "Please enter the password";
    return
  } else if (!$scope.ems.emid) {
    $scope.loginWarning = "Please specify option";
    return
  } else {
    var regem = ($scope.user.em).replace(new RegExp('[.]', 'g'), '-dot-');
    var regps = ($scope.user.ps).replace(new RegExp('[.]', 'g'), '-dot-').replace(new RegExp('\\[', 'g'), '-sqbl-');
    if (!$scope.user.un) {
      var regun = regem;
    } else {
      var regun = ($scope.user.un).replace(new RegExp('[.]', 'g'), '-dot-').replace(new RegExp('\\[', 'g'), '-sqbl-');
    }
  }
    var userparams =
      {
        em: regem,
        ps: regps,
        un: regun,
        rm: $scope.ems.emid
      };
  $http({
          method  : 'POST',
          url     : 'php/registersubmit.php',
          data    : userparams,
          headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
           })
        .then(function(response) {
            if (response.data.sitems) {
              if (response.data.sitems[0].Info) {
                $scope.showRegister = false;
                $scope.loginWarning = response.data.sitems[0].Info;
                $scope.user = {};
                $scope.passwordStrength["color"] = "grey";
                $scope.passwordRegister = "Use at least one an uppercase letter, a number and a special character";
              } else if (response.data.sitems[0].Error) {
                $scope.showLogin = false;
                $scope.loginWarning = response.data.sitems[0].Error;
              }
            }
            return response.data.sitems;
        });
      };
// *************************************** //
$scope.changepassConfirmation = function () {
  if (!$scope.user.resend_email) {
    $scope.loginWarning = "invalid email format";
    return
  }
var regem = ($scope.user.resend_email).replace(new RegExp('[.]', 'g'), '-dot-');
var userparams =
  {
    em: regem
  };
$http({
      method  : 'POST',
      url     : 'php/requestforpassword.php',
      data    : userparams,
      headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
       })
    .then(function(response) {
        if (response.data.info[0].ConfirmationStatus) {
          $scope.showRegister = false;
          $scope.loginWarning = response.data.info[0].ConfirmationStatus;
          $scope.resend_email = "";
          $scope.showPasswordForm = false;
        } else {
          $scope.showLogin = true;
          $scope.loginWarning = response.data.info[0].ConfirmationStatus;
        }
        return response.data.info;
    });
  };
//******************************************************************//
        mCtrl.CloseModal = function () {
          $scope.loginWarning = "";
        // alert("You clicked the cancel button.");
        $uibModalInstance.dismiss('cancel');
      };
  }
})();
