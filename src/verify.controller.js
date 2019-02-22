(function () {
  'use strict';
  angular.module('GJApp')
  .controller('VerifyController', VerifyController);
  VerifyController.$inject = ['$scope', '$http', 'info'];
  function VerifyController($scope, $http, info) {
    var vCtrl = this;
    vCtrl.info = info;
    $scope.user = {};
    $scope.loginWarningResend = "";
    // ***************************************** //
    $scope.resendConfirmation = function() {
        var regem = ($scope.user.resend_email).replace(new RegExp('[.]', 'g'), '-dot-');
        var userparams =
          {
            em: regem
          };
      $http({
              method  : 'POST',
              url     : 'php/resendconfirmation.php',
              data    : userparams,
              headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
               })
            .then(function(response) {
                if (response.data.info[0].ConfirmationStatus) {
                  $scope.showRegister = false;
                  $scope.loginWarning = "";
                  $scope.loginWarningResend = response.data.info[0].ConfirmationStatus;
                  $scope.resend_email = "";
                } else {
                  $scope.showLogin = true;
                  $scope.loginWarning = "";
                  $scope.loginWarningResend = response.data.info[0].ConfirmationStatus;
                }
                return response.data.info;
            });
          };
  }
})();
