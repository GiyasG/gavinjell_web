(function () {
  'use strict'
  angular.module('data')
  .service('DataService', DataService)
  .factory('FData', FData);
  DataService.$inject = ['$http', '$stateParams'];
    function DataService($http, $stateParams) {
      var service = this;
      service.isLoggedIn = function (param) {
        return $http.get("php/isloggedin.php?"+param)
          .then(function (response) {
          return response.data.isloggedin;
        });
      };
       service.getItems = function (param, id) {
        if (!id) {
          return $http.get("php/data.php?db="+param)
          .then(function (response) {
            return response.data.items;
          });
        } else {
          return $http.get("php/data.php?db="+param+"&id="+id)
          .then(function (response) {
            return response.data.items;
          });
        }
      };
    service.CheckoutItems = function (basket) {
        return $http.get("php/checkout.php")
          .then(function (response) {
          return response.data.cart;
          });
        };
        service.VerifyEmail = function (sl, tk) {
          return $http.get("php/verifyemail.php?selector="+sl+"&token="+tk)
            .then(function (response) {
            return response.data.info;
          });
        };
        service.resetPassword = function (sl, tk) {
          return $http.get("php/canresetpassword.php?selector="+sl+"&token="+tk)
            .then(function (response) {
            return response.data.info;
          });
        };
      }

        FData.$inject = ['$sce'];
        function FData($sce) {
        var fD = this;
        return {
        description: function(string) {
                 return $sce.trustAsHtml(string);
              }
          }
          // this.uCanTrust =
        }

})();
