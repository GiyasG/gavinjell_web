(function () {
'use strict'
angular.module('GJApp', ['ui.router', 'data', 'ui.bootstrap', 'ngFileUpload'])
.config(config);

config.$inject = ['$httpProvider'];
function config($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

})();

(function() {
"use strict";

angular.module('GJApp')
.component('loading', {
  template: '<img src="img/infinity.svg" ng-if="$ctrl.show">',
  controller: LoadingController
});


LoadingController.$inject = ['$rootScope'];
function LoadingController ($rootScope) {
  var $ctrl = this;
  var listener;

  $ctrl.$onInit = function() {
    $ctrl.show = false;
    listener = $rootScope.$on('spinner:activate', onSpinnerActivate);
  };

  $ctrl.$onDestroy = function() {
    listener();
  };

  function onSpinnerActivate(event, data) {
    $ctrl.show = data.on;
  }
}

})();

(function() {
"use strict";

angular.module('GJApp')
.factory('loadingHttpInterceptor', LoadingHttpInterceptor);

LoadingHttpInterceptor.$inject = ['$rootScope', '$q'];
/**
 * Tracks when a request begins and finishes. When a
 * request starts, a progress event is emitted to allow
 * listeners to determine when a request has been initiated.
 * When the response completes or a response error occurs,
 * we assume the request has ended and emit a finish event.
 */
function LoadingHttpInterceptor($rootScope, $q) {

  var loadingCount = 0;
  var loadingEventName = 'spinner:activate';

  return {
    request: function (config) {
      // console.log("Inside interceptor, config: ", config);

      if (++loadingCount === 1) {
        $rootScope.$broadcast(loadingEventName, {on: true});
      }

      return config;
    },

    response: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      return response;
    },

    responseError: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      return $q.reject(response);
    }
  };
}

})();

(function () {
'use strict'
angular.module('data', []);
})();

(function () {
  'use strict'

  angular.module('data')
  .service('DataService', DataService);

  DataService.$inject = ['$http', '$stateParams'];
    function DataService($http, $stateParams) {
      var service = this;

      service.isLoggedIn = function () {
        return $http.get("php/isloggedin.php")
          .then(function (response) {
          return response.data.isloggedin;
        });
      };

       service.getAllItems = function () {
        return $http.get("php/data.php")
          .then(function (response) {
            console.log("all items:"+response.data);
          return response.data.items;
        });
      };

      service.CheckoutItems = function (basket) {
        // console.log("basket in service: "+basket);
        // var basketitems = basket;
        // return basketitems
        return $http.get("php/checkout.php")
          .then(function (response) {
          console.log(response.data);
          return response.data.cart;
          });
        };

        service.VerifyEmail = function (sl, tk) {
          // console.log($stateParams);
          return $http.get("php/verifyemail.php?selector="+sl+"&token="+tk)
            .then(function (response) {
            console.log(response.data.info);
            return response.data.info;
          });
        };

        service.resetPassword = function (sl, tk) {
          return $http.get("php/canresetpassword.php?selector="+sl+"&token="+tk)
            .then(function (response) {
            console.log(response.data.info);
            return response.data.info;
          });
        };

      }
})();

(function () {
  'use strict';

  angular.module('GJApp')
  .controller('HomeController', HomeController)
  .directive('sessionCart', SessionCartDirective)
  .directive('sessionLogin', SessionLoginDirective)
  .directive('sessionRegister', SessionRegisterDirective)
  .directive('forgottenPassword', ForgottenPassordDirective);

  HomeController.$inject = ['$scope', '$http', 'isloggedin', '$uibModal', '$log', 'Upload'];

    function HomeController($scope, $http, isloggedin, $uibModal, $log, Upload) {

        var hCtrl = this;
        //**************** Data for Dbase Upload ********************//
          $scope.fElements = {};
          $scope.fElements.sizes =
          {
            "i39" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i40" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i41" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i42" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i43" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i44" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i45" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
          };
          console.log($scope.fElements.sizes);
        //**********************************************************//
        //**************** File Upload *********************//
        $scope.onFileSelect = function(file) {

          console.log(file);
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
                    console.log($scope.message);
                }).error(function(data, status) {
                    $scope.message = data;
                });
        };

        //************************************************//
        //****************** MODAL ****************//
        hCtrl.data = false;

          hCtrl.open = function () {
            var modalInstance = $uibModal.open({
              // animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'src/template/myModalContent.html',
              controller: 'ModalInstanceController',
              controllerAs: 'mCtrl',
              // size: size,
              resolve: {
                data: function () {
                  console.log(hCtrl.data);
                  return hCtrl.data;
                }
              }
            });

            modalInstance.result.then(function () {
              $scope.showLogin = false;
              $scope.hasRoleAdmin = true;
              // alert($scope.showLogin);
            });
          };
        //*****************************************//
        $scope.hasRoleAdmin = false;
        hCtrl.isloggedin = isloggedin;
        if (hCtrl.isloggedin[2].Role != null) {
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
          console.log("Logged out "+hCtrl.isloggedin[1].items);
        } else {
          $scope.showLogin = false;
          $scope.showRegister = false;
          hCtrl.data = true;
          if (isloggedin[1].items === null) {
            $scope.showCart = false;
          } else {
            $scope.showCart = true;
          }
          console.log("Logged in "+hCtrl.isloggedin[0]);
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
hCtrl.emptyCart = function () {
$http({
      method  : 'POST',
      url     : 'php/emptyCart.php'
       })
    .then(function(response) {
        hCtrl.isloggedin[1].items = response.data.cart;
        $scope.showCart = false;
        return response.data.cart;
    });
  };


// ***************************************** //
          $scope.openloginForm = function() {
            // console.log("Clicked open");
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
            // console.log("Clicked close");
            if ($scope.showLoginForm) {
              $scope.loginWarning = "";
              $scope.showLoginForm = false;
              $scope.showPasswordForm = false;
              $scope.showPasswordChange = false;
            }
          };


          // $scope.openregisterForm = function() {
          //   // console.log("Clicked open");
          //   if (!($scope.showRegisterForm)) {
          //     $scope.loginWarning = "";
          //     $scope.showRegisterForm = true;
          //     $scope.showLoginForm = false;
          //     $scope.showPasswordForm = false;
          //     $scope.showPasswordChange = false;
          //   }
          // };

          $scope.closeregisterForm = function() {
            // console.log("Clicked close");
            if ($scope.showRegisterForm) {
              $scope.loginWarning = "";
              $scope.showRegisterForm = false;
              $scope.showPasswordForm = false;
              $scope.showPasswordChange = false;
            }
          };
};

    function SessionCartDirective () {
      return {
        templateUrl: 'src/template/session-cart.html'
      }
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
                console.log($scope.rms.model);
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

                  console.log(userparams);
              $http({
                      method  : 'POST',
                      url     : 'php/loginsubmit.php',
                      data    : userparams,
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                       })
                    .then(function(response) {
                        if (response.data.isloggedin[0].isLoggedIn == "1") {
                          $scope.showLogin = true;
                          $scope.showLoginForm = false;
                          $scope.hasRoleAdmin = true;
                          $scope.user = {};
                          console.log("Hello"+$scope.hasRoleAdmin);
                          $uibModalInstance.close();
                        } else {
                          $scope.hasRoleAdmin = false;
                          $scope.showLogin = false;
                          $scope.loginWarning = response.data.isloggedin[0].Error;
                          console.log("Bye"+$scope.hasRoleAdmin);
                          console.log($scope.loginWarning);
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
            // console.log($scope.ems);

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
    console.log(value.length);
    $scope.passwordStrength["color"] = "green";
    $scope.disabledRegister = false;
    $scope.passwordRegister = "Strong password";
  } else if(mediumRegex.test(value) & value.length >= 8) {
    console.log(value.length);
    $scope.passwordStrength["color"] = "orange";
    $scope.disabledRegister = false;
    $scope.passwordRegister = "Fair password";
  } else {
    console.log(value.length);
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
    console.log($scope.ems.emid);
  }
    var userparams =
      {
        em: regem,
        ps: regps,
        un: regun,
        rm: $scope.ems.emid
      };
      console.log(userparams);

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
                console.log($scope.loginWarning);
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
console.log(regem);
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

(function () {
  'use strict';

  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/items.template.html',
    bindings: {
      items: '<'
        }
  });

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .controller('ItemsController', ItemsController)
  .directive('sessionBasket', SessionBasketDirective);

  ItemsController.$inject = ['items', '$http'];

  function ItemsController(items, $http) {
    var itemsCtrl = this;
    itemsCtrl.items = items;
    console.log("iCtrl: "+itemsCtrl.items[0].all[0]);

    itemsCtrl.sz = "";

    console.log(itemsCtrl.items);

  // itemsCtrl.isClicked = function($index){
  //       console.log($index);
  //       var color = itemsCtrl.items[0].all[$index].clicked ? 'red' : 'blue';
  //       return {color:color};
  //   }

  itemsCtrl.selectAllQuantities = function (sizeId, item_id, arr_ind) {
    // console.log(sizeId+" "+item_id+" "+arr_ind);
    itemsCtrl.sizeClicked = sizeId+arr_ind;
    console.log(itemsCtrl.sizeClicked);

      itemsCtrl.id = item_id;

      var qty = itemsCtrl.items[0].all[arr_ind][sizeId];
      // console.log("gty: "+qty);
      // console.log("gty: "+((itemsCtrl.items[0].all)[arr_ind][sizeId]));
      var x = sizeId.substring(3,1);
      itemsCtrl.sz = x;
      console.log(itemsCtrl.sz);

      itemsCtrl.selectQuantities = [];
            itemsCtrl.selectQuantities.push({id1: arr_ind, id2: item_id, size: x, qtt: qty});
      itemsCtrl.oneSizeQuantities = [];
            for (var i = 0; i < qty; i++) {
              itemsCtrl.oneSizeQuantities.push({ind: arr_ind, size: i+1});
            }
            console.log(itemsCtrl.oneSizeQuantities);
      };


   itemsCtrl.changeQuantity = function(quantity) {
      if (quantity) {
        itemsCtrl.itemSelected = [];
        itemsCtrl.itemSelected.push(quantity.size);
        itemsCtrl.qt = quantity.size;
      }
    };


    itemsCtrl.selectSizes = [
      {id: 'i39all', name: '39'}, {id: 'i40all', name: '40'}, {id: 'i41all', name: '41'}, {id: 'i42all', name: '42'},
      {id: 'i43all', name: '43'}, {id: 'i44all', name: '44'}, {id: 'i45all', name: '45'}
    ];

    // ***************************************** //
    itemsCtrl.addToCart = function () {
    var userparams =
      {
        id: itemsCtrl.id,
        qty: itemsCtrl.qt,
        siz: itemsCtrl.sz
      };

    $http({
          method  : 'POST',
          url     : 'php/getCartItems.php',
          data    : userparams,
          headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
           })
        .then(function(response) {
            itemsCtrl.items[1].cart = response.data.cart;
            // console.log(response.data.cart);
            itemsCtrl.qt = 0;
            return response.data.cart;
        });
      };

      // ***************************************** //
      itemsCtrl.emptyCart = function () {
      $http({
            method  : 'POST',
            url     : 'php/emptyCart.php'
             })
          .then(function(response) {
              itemsCtrl.items[1].cart = response.data.cart;
              return response.data.cart;
          });
        };
  }

  function SessionBasketDirective () {
    return {
      templateUrl: 'src/template/session-basket.html'
    }
  };


})();

(function () {
  'use strict';

  angular.module('GJApp')
  .component('cart', {
    templateUrl: 'src/template/cart.template.html',
    bindings: {
      items: '<'
        }
  });

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .controller('CartController', CartController);

  CartController.$inject = ['items'];
  function CartController(items) {
    var cartCtrl = this;
    cartCtrl.items = items;
    console.log("cCtrl: " + items);
    console.log(cartCtrl.items);

  }

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .component('checkout', {
    templateUrl: 'src/template/checkout.template.html',
    bindings: {
      cart: '<'
        }
  });

})();

(function () {
  'use strict';
  angular.module('GJApp')
  .controller('CheckoutController', CheckoutController);
  CheckoutController.$inject = ['cart'];
  function CheckoutController(cart) {
    var bCtrl = this;
    bCtrl.cart = cart;
    console.log("bCtrl: "+bCtrl.cart[0].description);
  }
})();

(function () {
  'use strict';

  angular.module('GJApp')
  .component('verify', {
    templateUrl: 'src/template/verify.template.html',
    bindings: {
      info: '<'
        }
  });

})();

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
        console.log(regem);
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
                  // $scope.showRegisterForm = false;
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

    // ***************************************** //


  }

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .component('changepassword', {
    templateUrl: 'src/template/passwordchange.template.html',
    bindings: {
      info: '<'
        }
  });

})();

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
console.log("cpCtrl: "+$scope);
console.log($stateParams);
    // ***************************************** //
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
          console.log(value.length);
          $scope.passwordStrength["color"] = "green";
          $scope.passwordRegister = "Strong password";
        } else if(mediumRegex.test(value) & value.length >= 8) {
          console.log(value.length);
          $scope.passwordStrength["color"] = "orange";
          $scope.passwordRegister = "Fair password";
        } else {
          console.log(value.length);
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

    // ***************************************** //


  }

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .component('items', {
    templateUrl: 'src/template/admin.template.html',
    bindings: {
      items: '<'
        }
  });

})();

(function () {
  'use strict';

  angular.module('GJApp')
  .controller('AdminController', AdminController)
  .directive('adminAdd', AdminAddDirective)
  .directive('adminUpdate', AdminUpdateDirective);


  AdminController.$inject = ['$scope', '$http', 'Upload', 'items'];

    function AdminController($scope, $http, Upload, items) {

        var aCtrl = this;
        aCtrl.items = items;
        $scope.updateIndex = null;
        $scope.AddNewRecord = false;
        $scope.hasRoleAdmin = aCtrl.items[2].AdminIsIn;
        console.log($scope.hasRoleAdmin);

        //**************** Data for Dbase Upload ********************//
          $scope.itemU = {};
          $scope.fElements = {};
          $scope.fElements.sizes =
          {
            "i39" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i40" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i41" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i42" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i43" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i44" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
            "i45" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
          };
          console.log(aCtrl.items[0].all.length);
          console.log(aCtrl.items[0].all);
        //**********************************************************//
        //**************** File Upload *********************//
        $scope.onFileSelect = function(file) {
          // console.log(file);
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


                    if ($scope.message.info[0].newitem[0].id) {

                      var newitem = {};
                      newitem.name = $scope.message.info[0].newitem[0].sname;
                      newitem.description = $scope.message.info[0].newitem[0].sdescription;
                      newitem.price = $scope.message.info[0].newitem[0].sprice;
                      newitem.image = $scope.message.info[0].newitem[0].simage;
                      newitem.id = $scope.message.info[0].newitem[0].id;

                      aCtrl.items[0].all.push(newitem);

                      console.log($scope.message.info[0].newitem[0].id);
                      $scope.AddNewRecord = false;
                      $scope.fElements = {};
                      $scope.fElements.sizes =
                      {
                        "i39" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i40" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i41" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i42" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i43" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i44" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                        "i45" : {"all": "0", "reserved": "0", "forsale": "0", "sold": "0"},
                      };
                    }
                }).error(function(data, status) {
                    $scope.message = data;
                });
        };

        //************************************************//
        $scope.DeleteItem = function(id) {
            console.log("id is: "+id);
          $http({
                method  : 'POST',
                url     : 'php/DeleteItem.php',
                data    : {id: id},
                headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                 })
              .then(function(response) {
                  console.log(response.data.info);
                  var rid = aCtrl.items[0].all.findIndex(x => x.id === id);
                  aCtrl.items[0].all.splice(rid, 1);
                  return response.data.info;
              });
        };

        $scope.UpdateItem = function (id, sid) {
          $scope.message = "";
          $scope.updateIndex = sid;
          $http({
                method  : 'POST',
                url     : 'php/getUpdateItem.php',
                data    : {id: id},
                headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                 })
              .then(function(response) {
                  $scope.itemU = response.data.item[0];
                  console.log($scope.itemU);
                  return response.data.item;
              });
            }


          //**************** File Update *********************//
          $scope.onFileUpdate = function(file) {

            // console.log(file);
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/update.php',
                      method: 'POST',
                      file: file,
                      data: {
                                'item': $scope.itemU
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      $scope.updateIndex = null;
                      console.log($scope.message);

                      var uitem = {};
                      uitem.name = $scope.message.info[0].updateitem[0].name;
                      uitem.description = $scope.message.info[0].updateitem[0].description;
                      uitem.price = $scope.message.info[0].updateitem[0].price;
                      uitem.image = $scope.message.info[0].updateitem[0].image;
                      uitem.id = $scope.message.info[0].updateitem[0].id;

                      // console.log(newitem);
                      var rid = aCtrl.items[0].all.findIndex(x => x.id === $scope.itemU.id);
                      aCtrl.items[0].all[rid] = uitem;
                      console.log(aCtrl.items[0].all);
                      console.log(rid);

                      // aCtrl.items[0].all.push(updateitem);
                      // $scope.itemU = uitem;
                      // console.log($scope.itemU);


                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };

          //************************************************//

        $scope.AddItem = function() {
          $scope.AddNewRecord = true;
        }

        $scope.CloseAdd = function() {
          $scope.AddNewRecord = false;
        }

        $scope.CancelUpdate = function() {
          $scope.updateIndex = null;
        }
    };

    function AdminAddDirective () {
      return {
        templateUrl: 'src/template/admin-add.html'
        }
      }

    function AdminUpdateDirective () {
      return {
        templateUrl: 'src/template/admin-update.html'
                }
      }


})();

(function () {
'use strict';

angular.module('GJApp')
.config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {

  var home = {
    name: 'home',
    url: '/',
    templateUrl: 'src/template/home.template.html',
    controller: 'HomeController as hCtrl',
    resolve: {
      isloggedin: function (DataService) {
        return DataService.isLoggedIn();
      }
    }
  }

  var items = {
    name: 'items',
    url:'/items',
    views: {
        'content@': {
          templateUrl: 'src/template/items.template.html',
          controller: 'ItemsController as itemsCtrl',
          resolve: {
            items: ['DataService', function (DataService) {
              return DataService.getAllItems();
            }]
          }
    }
   }
  }

  var checkout = {
    name: 'checkout',
    // parent: 'home',
    url: '/checkout',
    // params: { basket: null },
    views: {
         'basket@': {
          templateUrl: 'src/template/checkout.template.html',
          controller: 'CheckoutController as bCtrl',
        }
      },
      resolve: {
                  // basketitems: function(DataService, $stateParams) {
                  //   console.log("basket in route: "+$stateParams.basket);
                  //   return DataService.CheckoutItems($stateParams.basket);
                    cart: function(DataService) {
                    return DataService.CheckoutItems();
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
    // parent: 'home',
    url: '/admin',
    // params: { basket: null },
    views: {
         'admin@': {
          templateUrl: 'src/template/admin.template.html',
          controller: 'AdminController as aCtrl',
        }
      },
      resolve: {
        items: ['DataService', function (DataService) {
          return DataService.getAllItems();
        }]
      }
  }

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state(home)
  .state(items)
  .state(checkout)
  .state(emailconfirmed)
  .state(passwordconfirmed)
  .state(admin)
 }
})();
