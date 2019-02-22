(function () {
  'use strict';
  angular.module('GJApp')
  .controller('PaperController', PaperController);
  PaperController.$inject = ['items', '$stateParams', '$scope', '$sce', 'Upload', '$http'];
  function PaperController(items, $stateParams, $scope, $sce, Upload, $http) {
    var paperCtrl = this;
    paperCtrl.items = items;
    if (paperCtrl.items[5].isIn === false) {
      $scope.showComment = false;
    } else {
      $scope.showComment = true;
    }
    console.log($scope.showComment);
    paperCtrl.newcomment = "";
    console.log(paperCtrl.newcomment);

    if (paperCtrl.items[7].comment[0]) {
      $scope.comments = paperCtrl.items[7].comment[0];
      console.log($scope.comments);
    }    window.scrollTo(0, 0);
    $scope.uCanTrust = function(string){
      return $sce.trustAsHtml(string);
    }

    //************Add Comment  *****************************//
    $scope.addComment = function (db, aid, id, text) {
      $scope.upload = Upload.upload({
          url: 'php/addComment.php',
          method: 'POST',
          data: {comment: text, authority_id: aid, idofdb: id, nameofdb : db}
      }).success(function(data, status, headers, config) {
          $scope.message = data;
          if (paperCtrl.items[7].comment[0]) {
            paperCtrl.items[7].comment[0].push($scope.message.info[0].newitem[0]);
          } else {
            paperCtrl.items[7].comment.push($scope.message.info[0].newitem[0]);
          }
          console.log(paperCtrl.items);
          paperCtrl.newcomment = "";
      }).error(function(data, status) {
          $scope.message = data;
      });
      }

      $scope.updateComment = function (db, aid, id, text) {
        $scope.upload = Upload.upload({
            url: 'php/updateComment.php',
            method: 'POST',
            data: {comment: text, authority_id: aid, idofdb: id, nameofdb : db}
        }).success(function(data, status, headers, config) {
            $scope.message = data;
            console.log(paperCtrl.items);
            paperCtrl.newcomment = "";
        }).error(function(data, status) {
            $scope.message = data;
        });

        }

        $scope.deleteComment = function(db, aid, id) {
          $http({
            url: 'php/deleteComment.php',
            method: 'POST',
            data: {id: id, aid: aid, db : db},
            headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(response) {
            var rid = paperCtrl.items[7].comment[0].findIndex(x => x.id === id);
            paperCtrl.items[7].comment[0].splice(rid,1);
          }, function(response) {
            $scope.message.info[1].message = response.data;
          });
        }

        $scope.uCanTrust = function(string, uid, id) {
            return $sce.trustAsHtml(string);
        }

        $scope.iseditable = function(uid, id) {
            if (uid==id) {
                $scope.editable = true;
            } else {
              $scope.editable = false;
            }
        }



    };
})();
