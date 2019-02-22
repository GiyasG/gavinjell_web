(function () {
  'use strict';
  angular.module('GJApp')
  .controller('AdminController', AdminController)
  .directive('adminAdd', AdminAddDirective)
  .directive('adminUpdate', AdminUpdateDirective)
  .directive('contactAdd', ContactAddDirective)
  .directive('contactUpdate', ContactUpdateDirective)
  .directive('projectAdd', ProjectAddDirective)
  .directive('projectUpdate', ProjectUpdateDirective)
  .directive('paperAdd', PaperAddDirective)
  .directive('paperUpdate', PaperUpdateDirective)
  .directive('teamAdd', TeamAddDirective)
  .directive('teamUpdate', TeamUpdateDirective)
  .directive('teamcontactAdd', TeamcontactAddDirective)
  .directive('teamcontactUpdate', TeamcontactUpdateDirective);
  AdminController.$inject = ['FData', '$state', '$scope', '$http', '$sce', 'Upload', 'items'];
    function AdminController(FData, $state, $scope, $http, $sce, Upload, items) {
        var aCtrl = this;
        $scope.fD = FData;
        aCtrl.items = items;
        if (aCtrl.items[5].Role === "Admin") {
            $scope.hasRoleAdmin = true;
        } else {
          window.scrollTo(0, 0);
          $state.go('home');
        }
        $scope.updateIndexItem = null;
        $scope.updateIndexProject = null;
        $scope.updateIndexPaper = null;
        $scope.updateIndexTeam = null;
        $scope.updateIndexContact = null;
        $scope.updateIndexTeamcontact = null;

        $scope.AddNewRecord = false;
        $scope.AddNewProject = false;
        $scope.AddNewPaper = false;
        $scope.AddNewTeam = false;
        $scope.AddNewTeamcontact = false;
        $scope.AddNewContact = false;
        $scope.tinymceModel = "";
        //**************** Data for Dbase Upload ********************//
          $scope.itemU = {};
          $scope.fElements = {};
          $scope.fElements.about = "";
          $scope.fElements.genders = {
            model: null,
            sex: ["male","female"]
         };
         $scope.fProjects = {};
         $scope.fPapers = {};
         $scope.fTeams = {};
         $scope.fContact = {};
         $scope.fTeamcontact = {};
         $scope.fTeams.genders = {
           model: null,
           sex: ["male","female"]
        };
        $scope.fProjects.authors = {
          model: {
            id: null,
            name: null,
          }
         };
         $scope.fPapers.authors = {
           model: {
             id: null,
             name: null,
           }
          };
          $scope.fSlides = {};
          $scope.fSlides.projects = {
            model: {
              id: null,
              name: null,
            }
           };
           $scope.fSlides.papers = {
             model: {
               id: null,
               name: null,
             }
            };
          $scope.author = [];
          $scope.disabledTM ={};
          $scope.disabledSI ={};
          angular.forEach(aCtrl.items[6].slide[0], function(value, key){
            $scope.disabledSI[value.id+value.title] = true;
          });
        //**************** Authority Add new record *********************//
        $scope.onFileSelect = function(file, abauth) {
          $scope.fElements.about = abauth;
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
                      newitem.id = $scope.message.info[0].newitem[0].id;
                      newitem.title = $scope.message.info[0].newitem[0].title;
                      newitem.name = $scope.message.info[0].newitem[0].name;
                      newitem.surname = $scope.message.info[0].newitem[0].surname;
                      newitem.about = $scope.message.info[0].newitem[0].about;
                      newitem.position = $scope.message.info[0].newitem[0].position;
                      newitem.dob = $scope.message.info[0].newitem[0].dob;
                      newitem.sex = $scope.message.info[0].newitem[0].genders.model;
                      newitem.image = $scope.message.info[0].newitem[0].filename;
                      aCtrl.items[0].all.push(newitem);
                      $scope.AddNewRecord = false;
                      $scope.fElements = {};
                    }
                }).error(function(data, status) {
                    $scope.message = data;
                });
        };
        //************************************************//
        $scope.DeleteItem = function(id) {
          $http({
                method  : 'POST',
                url     : 'php/DeleteItem.php',
                data    : {id: id},
                headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                 })
              .then(function(response) {
                  var rid = aCtrl.items[0].all.findIndex(x => x.id === id);
                  aCtrl.items[0].all.splice(rid, 1);
                  return response.data.info;
              });
        };
        $scope.UpdateItem = function (id, sid) {
          $scope.message = "";
          $scope.updateIndexItem = sid;
          $http({
                method  : 'POST',
                url     : 'php/getUpdateItem.php',
                data    : {id: id},
                headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                 })
              .then(function(response) {
                  $scope.itemU = response.data[0];
                  $scope.fElements.genders.model = $scope.itemU.sex;
                  return response.data[0];
              });
            }
          //**************** Authority Update *********************//
          $scope.onFileUpdate = function(file) {
            if ($scope.fElements.genders.model != null) {
              $scope.itemU.sex = $scope.fElements.genders.model;
            }
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/update.php',
                      method: 'POST',
                      file: file,
                      data: {
                                'item': $scope.itemU
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.uadata = data;
                      $scope.updateIndexItem = null;
                      var uitem = {};
                      uitem.authority_id = $scope.uadata.info[0].updateitem[0].id;
                      uitem.title = $scope.uadata.info[0].updateitem[0].title;
                      uitem.name = $scope.uadata.info[0].updateitem[0].name;
                      uitem.surname = $scope.uadata.info[0].updateitem[0].surname;
                      uitem.about = $scope.uadata.info[0].updateitem[0].about;
                      uitem.position = $scope.uadata.info[0].updateitem[0].position;
                      uitem.dob = $scope.uadata.info[0].updateitem[0].dob;
                      uitem.sex = $scope.uadata.info[0].updateitem[0].sex;
                    if (file) {
                      $scope.itemU.image = $scope.uadata.info[0].updateitem[0].image;
                    }
                      uitem.image = $scope.uadata.info[0].updateitem[0].image;
                      var rid = aCtrl.items[0].all[0].findIndex(x => x.authority_id === uitem.authority_id);
                      aCtrl.items[0].all[0][rid] = uitem;
                  }).error(function(data, status) {
                      $scope.message.info[1].message = data;
                  });
          };
          //**************** Contact Add new record *********************//
          $scope.onContactSelect = function() {
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/uploadContact.php',
                      method: 'POST',
                      // file: file,
                      data: {
                                'item': $scope.fContact
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      if ($scope.message.info[0].newitem[0].id) {
                        var newitem = {};
                        newitem.id = $scope.message.info[0].newitem[0].id;
                        newitem.propertytype = $scope.message.info[0].newitem[0].propertytype;
                        newitem.country = $scope.message.info[0].newitem[0].country;
                        newitem.city = $scope.message.info[0].newitem[0].city;
                        newitem.postcode = $scope.message.info[0].newitem[0].postcode;
                        newitem.street = $scope.message.info[0].newitem[0].street;
                        newitem.phone = $scope.message.info[0].newitem[0].phone;
                        newitem.email = $scope.message.info[0].newitem[0].email;
                        newitem.authority_id = $scope.message.info[0].newitem[0].authority_id;
                        aCtrl.items[4].all.push(newitem);
                        $scope.AddNewContact = false;
                        $scope.fContact = {};
                      }
                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };
          //************************************************//
          $scope.DeleteContact = function(aid, id) {
            $http({
                  method  : 'POST',
                  url     : 'php/DeleteContact.php',
                  data    : {aid: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    var rid = aCtrl.items[4].contact[0].findIndex(x => x.id === id);
                    aCtrl.items[4].contact[0].splice(rid, 1);
                    return response.data.info;
                });
          };
          $scope.UpdateContact = function (aid, id, sid) {
            $scope.message = "";
            $scope.updateIndexContact = sid;
            $http({
                  method  : 'POST',
                  url     : 'php/getUpdateContact.php',
                  data    : {aid: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    $scope.itemU = response.data[0];
                    return response.data[0];
                });
              }
          //**************** Contact Update *********************//
          $scope.onContactUpdate = function() {
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/updateContact.php',
                      method: 'POST',
                      // file: file,
                      data: {
                                'item': $scope.itemU
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      var uitem = {};
                      uitem.id = $scope.message.info[0].updateitem[0].id;
                      uitem.propertytype = $scope.message.info[0].updateitem[0].propertytype;
                      uitem.country = $scope.message.info[0].updateitem[0].country;
                      uitem.city = $scope.message.info[0].updateitem[0].city;
                      uitem.postcode = $scope.message.info[0].updateitem[0].postcode;
                      uitem.street = $scope.message.info[0].updateitem[0].street;
                      uitem.phone = $scope.message.info[0].updateitem[0].phone;
                      uitem.email = $scope.message.info[0].updateitem[0].email;
                      uitem.authority_id = $scope.message.info[0].updateitem[0].authority_id;
                      var rid = aCtrl.items[4].contact[0].findIndex(x => x.id === $scope.itemU.id);
                      aCtrl.items[4].contact[0][rid] = uitem;
                      $scope.updateIndexContact = null;
                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };
          //**************** Project Add new record *********************//
          $scope.onProjectSelect = function(file, id) {
            console.log($scope.fProjects);
            if ($scope.author) {
              $scope.fProjects.author = $scope.author
            }
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/uploadProject.php',
                      method: 'POST',
                      file: file,
                      data: {
                                'item': $scope.fProjects,
                                'authority_id': id
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      if ($scope.message.info[0].newitem[0].id) {
                        var newitem = {};
                        newitem.id = $scope.message.info[0].newitem[0].id;
                        newitem.title = $scope.message.info[0].newitem[0].title;
                        newitem.description = $scope.message.info[0].newitem[0].description;
                        newitem.url = $scope.message.info[0].newitem[0].url;
                        newitem.started = $scope.message.info[0].newitem[0].started;
                        newitem.finished = $scope.message.info[0].newitem[0].finished;
                        newitem.authority_id = $scope.message.info[0].newitem[0].authority_id;
                        newitem.image = $scope.message.info[0].newitem[0].image;
                        if ($scope.message.info[0].newitem[0].author) {
                          newitem.author = $scope.message.info[0].newitem[0].author.name;
                        }
                        aCtrl.items[1].projects[0][0].push(newitem);
                        $scope.AddNewProject = false;
                        $scope.fProjects = {};
                      }
                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };
          //**************** Project Update *********************//
          $scope.onProjectUpdate = function(file) {
              $scope.message = "";
              if ($scope.author) {
                $scope.itemU.author = $scope.author
              }
                  $scope.upload = Upload.upload({
                      url: 'php/updateProject.php',
                      method: 'POST',
                      file: file,
                      data: {
                                'item': $scope.itemU
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      var uitem = {};
                      uitem.id = $scope.message.info[0].updateitem[0].id;
                      uitem.title = $scope.message.info[0].updateitem[0].title;
                      uitem.description = $scope.message.info[0].updateitem[0].description;
                      uitem.url = $scope.message.info[0].updateitem[0].url;
                      if (file) {
                        $scope.itemU.image = $scope.message.info[0].updateitem[0].image;
                      }
                      uitem.image = $scope.message.info[0].updateitem[0].image;
                      uitem.started = $scope.message.info[0].updateitem[0].started;
                      uitem.finished = $scope.message.info[0].updateitem[0].finished;
                      uitem.authority_id = $scope.message.info[0].updateitem[0].authority_id;
                      var rid = aCtrl.items[1].projects[0][0].findIndex(x => x.id === $scope.itemU.id);
                      aCtrl.items[1].projects[0][0][rid] = uitem;
                      $scope.updateIndexProject = null
                      $scope.disabledTM = {};
                      $scope.author = [];
                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };
          //************************************************//
          $scope.DeleteProject = function(aid, id) {
            $http({
                  method  : 'POST',
                  url     : 'php/DeleteProject.php',
                  data    : {aid: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    var rid = aCtrl.items[1].projects[0][0].findIndex(x => x.id === id);
                    aCtrl.items[1].projects[0][0].splice(rid, 1);
                    return response.data.info;
                });
          };
          // **************** GetUpdateProject *********************//
          $scope.UpdateProject = function (aid, id, sid) {
            $scope.message = "";
            $scope.updateIndexProject = sid;
            $http({
                  method  : 'POST',
                  url     : 'php/getUpdateProject.php',
                  data    : {ida: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    $scope.itemU = response.data[0];
                    if ($scope.itemU.author) {
                      angular.forEach($scope.itemU.author, function(value, key){
                        $scope.disabledTM[$scope.itemU.author[key].team_id] = true;
                      });
                    }
                    $scope.fProjects.authors = $scope.itemU.team;
                    return response.data;
                });
              }
              //**************** Project Add new record *********************//
              $scope.onPaperSelect = function(file, id) {
                  $scope.message = "";
                      $scope.upload = Upload.upload({
                          url: 'php/uploadPaper.php',
                          method: 'POST',
                          file: file,
                          data: {
                                    'authority_id': id,
                                    'item': $scope.fPapers
                                }
                      }).success(function(data, status, headers, config) {
                          $scope.message = data;
                          if ($scope.message.info[0].newitem[0].id) {
                            var newitem = {};
                            newitem.id = $scope.message.info[0].newitem[0].id;
                            newitem.title = $scope.message.info[0].newitem[0].title;
                            newitem.url = $scope.message.info[0].newitem[0].url;
                            newitem.description = $scope.message.info[0].newitem[0].description;
                            newitem.authority_id = $scope.message.info[0].newitem[0].authority_id;
                            newitem.image = $scope.message.info[0].newitem[0].image;
                            aCtrl.items[2].papers[0][0].push(newitem);
                            $scope.AddNewPaper = false;
                            $scope.fPapers = {};
                          }
                      }).error(function(data, status) {
                          $scope.message = data;
                      });
              };
              //**************** Project Update *********************//
              $scope.onPaperUpdate = function(file) {
                  $scope.message = "";
                  if ($scope.author) {
                    $scope.itemU.author = $scope.author
                  }
                      $scope.upload = Upload.upload({
                          url: 'php/updatePaper.php',
                          method: 'POST',
                          file: file,
                          data: {
                                    'item': $scope.itemU
                                }
                      }).success(function(data, status, headers, config) {
                          $scope.message = data;
                          var uitem = {};
                          uitem.title = $scope.message.info[0].updateitem[0].title;
                          uitem.description = $scope.message.info[0].updateitem[0].description;
                          uitem.url = $scope.message.info[0].updateitem[0].url;
                          if (file) {
                            $scope.itemU.image = $scope.message.info[0].updateitem[0].image;
                          }
                          uitem.image = $scope.message.info[0].updateitem[0].image;
                          uitem.id = $scope.message.info[0].updateitem[0].id;
                          uitem.authority_id = $scope.message.info[0].updateitem[0].authority_id;
                          var rid = aCtrl.items[2].papers[0][0].findIndex(x => x.id === $scope.itemU.id);
                          aCtrl.items[2].papers[0][0][rid] = uitem;
                          $scope.updateIndexPaper = null
                          $scope.disabledTM = {};
                          $scope.author = [];
                      }).error(function(data, status) {
                          $scope.message = data;
                      });
              };
              //************************************************//
              $scope.DeletePaper = function(aid, id) {
                $http({
                      method  : 'POST',
                      url     : 'php/DeletePaper.php',
                      data    : {aid: aid, id: id},
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                       })
                    .then(function(response) {
                      var rid = aCtrl.items[2].papers[0][0].findIndex(x => x.id === id);
                      aCtrl.items[2].papers[0][0].splice(rid, 1);
                      return response.data.info;
                    });
              };
              // **************** GetUpdatePaper *********************//
              $scope.UpdatePaper = function (aid, id, sid) {
                $scope.message = "";
                $scope.updateIndexPaper = sid;
                $http({
                      method  : 'POST',
                      url     : 'php/getUpdatePaper.php',
                      data    : {ida: aid, id: id},
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                       })
                    .then(function(response) {
                        $scope.itemU = response.data[0];
                        if ($scope.itemU.author) {
                          angular.forEach($scope.itemU.author, function(value, key){
                            $scope.disabledTM[$scope.itemU.author[key].team_id] = true;
                          });
                        }
                        $scope.fPapers.authors = $scope.itemU.team;
                        return response.data;
                    });
                  }
                  //**************** Team Add new record *********************//
                  $scope.onTeamSelect = function(file) {
                      $scope.message = "";
                          $scope.upload = Upload.upload({
                              url: 'php/uploadTeam.php',
                              method: 'POST',
                              file: file,
                              data: {
                                        'item': $scope.fTeams
                                    }
                          }).success(function(data, status, headers, config) {
                              $scope.message = data;
                              if ($scope.message.info[0].newitem[0].id) {
                                var newitem = {};
                                newitem.id = $scope.message.info[0].newitem[0].id;
                                newitem.authority_id = $scope.message.info[0].newitem[0].authority_id;
                                newitem.title = $scope.message.info[0].newitem[0].title;
                                newitem.name = $scope.message.info[0].newitem[0].name;
                                newitem.surname = $scope.message.info[0].newitem[0].surname;
                                newitem.about = $scope.message.info[0].newitem[0].about;
                                newitem.position = $scope.message.info[0].newitem[0].position;
                                newitem.dob = $scope.message.info[0].newitem[0].dob;
                                newitem.sex = $scope.message.info[0].newitem[0].genders.model;
                                newitem.image = $scope.message.info[0].newitem[0].filename;
                                aCtrl.items[3].teams[0][0].push(newitem);
                                $scope.AddNewTeam = false;
                                $scope.fTeams = {};
                              }
                          }).error(function(data, status) {
                              $scope.message = data;
                          });
                  };
                  //************************************************//
                  $scope.DeleteTeam = function(aid, id) {
                    $http({
                          method  : 'POST',
                          url     : 'php/DeleteTeam.php',
                          data    : {aid: aid, id: id},
                          headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                           })
                        .then(function(response) {
                            var rid = aCtrl.items[3].teams[0][0].findIndex(x => x.id === id);
                            aCtrl.items[3].teams[0][0].splice(rid, 1);
                            return response.data.info;
                        });
                  };
                  $scope.UpdateTeam = function (aid, id, sid) {
                    $scope.message = "";
                    $scope.updateIndexTeam = sid;
                    $http({
                          method  : 'POST',
                          url     : 'php/getUpdateTeam.php',
                          data    : {ida: aid, id: id},
                          headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                           })
                        .then(function(response) {
                            $scope.itemU = response.data[0];
                            $scope.fTeams.genders.model = $scope.itemU.sex;
                            return response.data[0];
                        });
                      }
                    //**************** Team Update *********************//
                    $scope.onTeamUpdate = function(file) {
                      if ($scope.fTeams.genders.model != null) {
                        $scope.itemU.sex = $scope.fTeams.genders.model;
                      }
                        $scope.message = "";
                            $scope.upload = Upload.upload({
                                url: 'php/updateTeam.php',
                                method: 'POST',
                                file: file,
                                data: {
                                          'item': $scope.itemU
                                      }
                            }).success(function(data, status, headers, config) {
                                $scope.uadata = data;
                                $scope.updateIndex = null;
                                var uitem = {};
                                uitem.id = $scope.uadata.info[0].updateitem[0].id;
                                uitem.authority_id = $scope.uadata.info[0].updateitem[0].authority_id;
                                uitem.title = $scope.uadata.info[0].updateitem[0].title;
                                uitem.name = $scope.uadata.info[0].updateitem[0].name;
                                uitem.surname = $scope.uadata.info[0].updateitem[0].surname;
                                uitem.about = $scope.uadata.info[0].updateitem[0].about;
                                uitem.position = $scope.uadata.info[0].updateitem[0].position;
                                uitem.dob = $scope.uadata.info[0].updateitem[0].dob;
                                uitem.sex = $scope.uadata.info[0].updateitem[0].sex;
                              if (file) {
                                $scope.itemU.image = $scope.uadata.info[0].updateitem[0].image;
                              }
                                uitem.image = $scope.uadata.info[0].updateitem[0].image;
                                var rid = aCtrl.items[3].teams[0][0].findIndex(x => x.id === uitem.id);
                                aCtrl.items[3].teams[0][0][rid] = uitem;
                                $scope.updateIndexTeam = null
                            }).error(function(data, status) {
                                $scope.message.info[1].message = data;
                            });
                    };
          //**************** TeamContact Add new record *********************//
          $scope.onTeamcontactSelect = function(id, aid) {
              $scope.message = "";
                  $scope.upload = Upload.upload({
                      url: 'php/uploadTeamcontact.php',
                      method: 'POST',
                      data: {
                                'item': $scope.fTeamcontact,
                                'id' : id,
                                'aid': aid
                            }
                  }).success(function(data, status, headers, config) {
                      $scope.message = data;
                      if ($scope.message.info[0].newitem[0].id) {
                        var newitem = {};
                        var contact = [{}];
                        newitem.contact_id = $scope.message.info[0].newitem[0].id;
                        newitem.propertytype = $scope.message.info[0].newitem[0].propertytype;
                        newitem.country = $scope.message.info[0].newitem[0].country;
                        newitem.city = $scope.message.info[0].newitem[0].city;
                        newitem.postcode = $scope.message.info[0].newitem[0].postcode;
                        newitem.street = $scope.message.info[0].newitem[0].street;
                        newitem.phone = $scope.message.info[0].newitem[0].phone;
                        newitem.email = $scope.message.info[0].newitem[0].email;
                        newitem.team_id = $scope.message.info[0].newitem[0].authority_id;
                        newitem.authority_id = $scope.message.info[0].newitem[0].authority_id;
                        var rid1 = aCtrl.items[3].teams[0][0].findIndex(x => x.id === id);
                        aCtrl.items[3].teams[0][0][rid1].contact = [];
                        aCtrl.items[3].teams[0][0][rid1].contact.push(newitem);
                        $scope.AddNewTeamcontact = false;
                        $scope.fTeamcontact = {};
                        $scope.updateIndexTeamcontact = null
                      }
                  }).error(function(data, status) {
                      $scope.message = data;
                  });
          };
          //************************************************//
          $scope.DeleteTeamcontact = function(aid, id) {
            $http({
                  method  : 'POST',
                  url     : 'php/DeleteTeamcontact.php',
                  data    : {aid: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    var rid1 = aCtrl.items[3].teams[0][0].findIndex(x => x.id === aid);
                    var rid = aCtrl.items[3].teams[0][0][rid1].contact.findIndex(x => x.id === id);
                    aCtrl.items[3].teams[0][0][rid1].contact.splice(rid, 1);
                    if (aCtrl.items[3].teams[0][0][rid1].contact.length===0) {
                      $scope.AddNewTeamcontact = true;
                    }
                    return response.data.info;
                });
          };
          $scope.UpdateTeamcontact = function (aid, id, sid) {
            $scope.message = "";
            $scope.updateIndexTeamcontact = sid;
            $http({
                  method  : 'POST',
                  url     : 'php/getUpdateTeamcontact.php',
                  data    : {ida: aid, id: id},
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                   })
                .then(function(response) {
                    $scope.itemU = response.data[0];
                    return response.data[0];
                });
              }
            //**************** Team Update *********************//
            $scope.onTeamcontactUpdate = function() {
                $scope.message = "";
                    $scope.upload = Upload.upload({
                        url: 'php/updateTeamcontact.php',
                        method: 'POST',
                        data: {
                                  'item': $scope.itemU
                              }
                    }).success(function(data, status, headers, config) {
                        $scope.message = data;
                        $scope.updateIndex = null;
                        var uitem = {};
                        uitem.id = $scope.message.info[0].updateitem[0].id;
                        uitem.propertytype = $scope.message.info[0].updateitem[0].propertytype;
                        uitem.country = $scope.message.info[0].updateitem[0].country;
                        uitem.city = $scope.message.info[0].updateitem[0].city;
                        uitem.postcode = $scope.message.info[0].updateitem[0].postcode;
                        uitem.street = $scope.message.info[0].updateitem[0].street;
                        uitem.phone = $scope.message.info[0].updateitem[0].phone;
                        uitem.email = $scope.message.info[0].updateitem[0].email;
                        uitem.authority_id = $scope.message.info[0].updateitem[0].authority_id;
                        uitem.team_id = $scope.message.info[0].updateitem[0].team_id;
                        var rid1 = aCtrl.items[3].teams[0][0].findIndex(x => x.id === uitem.team_id);
                        var rid = aCtrl.items[3].teams[0][0][rid1].contact.findIndex(x => x.id === uitem.id);
                        aCtrl.items[3].teams[0][0][rid1].contact[rid] = uitem;
                        $scope.updateIndexTeamcontact = null
                    }).error(function(data, status) {
                        $scope.message.info[1].message = data;
                    });
            };
  //************************************************//
        $scope.AddItem = function() {
          $scope.AddNewRecord = true;
        }

        $scope.CloseAdd = function() {
          $scope.AddNewRecord = false;
        }

        $scope.CancelUpdate = function(id) {
          $scope.updateIndexItem = null;
          $scope.itemU.authority_id = id;
          if ($scope.uadata && $scope.uadata.info[1].message) {
            $scope.uadata.info[1].message = "";
          } else if ($scope.uadata && !$scope.uadata.info) {
            $scope.uadata = "";
          }
        }
        //************************************************//
        $scope.AddProject = function(id) {
          $scope.AddNewProject = true;
          $scope.fProjects.id = id;
          $scope.disabledTM = {};
          $scope.author = [];
          $scope.fProjects.authors = aCtrl.items[3].teams[0];
        }
        $scope.CloseAddProject = function() {
          $scope.AddNewProject = false;
          $scope.author = [];
        }

        $scope.CancelUpdateProject = function(aid, id) {
          $scope.updateIndexProject = null;
          $scope.itemU.id = id;
          $scope.itemU.authority_id = aid;
          $scope.disabledTM = {};
          $scope.author = [];
        }

        //************************************************//
        $scope.AddPaper = function(id) {
          $scope.AddNewPaper = true;
          $scope.fPapers.id = id;
          $scope.disabledTM = {};
          $scope.author = [];
          $scope.fProjects.authors = aCtrl.items[3].teams[0];
        }

        $scope.CloseAddPaper = function() {
          $scope.AddNewPaper = false;
          $scope.author = [];
        }

        $scope.CancelUpdatePaper = function(aid, id) {
          $scope.updateIndexPaper = null;
          $scope.itemU.id = id;
          $scope.itemU.authority_id = aid;
          $scope.disabledTM = {};
          $scope.author = [];
        }
        //************************************************//

        $scope.AddTeam = function(id) {
          $scope.AddNewTeam = true;
          $scope.fTeams.id = id;
        }

        $scope.CloseAddTeam = function() {
          $scope.AddNewTeam = false;
        }

        $scope.CancelUpdateTeam = function(aid, id) {
          $scope.updateIndexTeam = null;
          $scope.itemU.id = id;
          $scope.itemU.authority_id = aid;

        }
        //************************************************//
        $scope.AddTeamContact = function(aid, id, sid) {
          $scope.AddNewTeamcontact = true;
          $scope.updateIndexTeamcontact = sid;
          $scope.fTeamcontact.id = id;
        }

        $scope.CloseAddTeamcontact = function() {
          $scope.AddNewTeamcontact = false;
          $scope.updateIndexTeamcontact = null;
        }

        $scope.CancelUpdateTeamcontact = function(id) {
          $scope.updateIndexTeamcontact = null;
          $scope.itemU.id = id;
        }

        //************************************************//

        $scope.AddContact = function(id) {
          $scope.AddNewContact = true;
          $scope.fContact.id = id;
        }

        $scope.CloseAddContact = function() {
          $scope.AddNewContact = false;
        }

        $scope.CancelUpdateContact = function(aid, id) {
          $scope.updateIndexContact = null;
          $scope.itemU.id = id;
          $scope.itemU.authority_id = aid;

        }

        //************************************************//
        $scope.addTM = function(model) {
            var rid = aCtrl.items[3].teams[0][0].findIndex(x => x.id === model);
            var rid1 = $scope.author.findIndex(x => x.id === model);
            if (rid>=0 && rid1<0) {
              $scope.disabledTM[aCtrl.items[3].teams[0][0][rid].id] = true;
              var valueToPush = {};
              valueToPush.id = aCtrl.items[3].teams[0][0][rid].id;
              valueToPush.name = aCtrl.items[3].teams[0][0][rid].titlet+" "
              + aCtrl.items[3].teams[0][0][rid].name+" "
              + aCtrl.items[3].teams[0][0][rid].surname;
              $scope.author.push(valueToPush);
            }
          }

        $scope.DeleteTM = function(model, pid, crudtype) {
          switch (crudtype) {
            case "add":
            var rid = $scope.author.name.findIndex(x => x.id === model);
            $scope.disabledTM[$scope.author.name[rid].title+$scope.author.name[rid].name+$scope.author.name[rid].surname] = false;
              break;
            case "update":
            var rid = $scope.author.findIndex(x => x.id === model);
            if ($scope.fProjects.authors) {
              var rid1 = $scope.fProjects.authors.findIndex(x => x.id === model);
            } else if ($scope.fPapers.authors) {
              var rid1 = $scope.fPapers.authors.findIndex(x => x.id === model);
            }
            $scope.disabledTM[$scope.author[rid].id] = false;
            $scope.author.splice(rid,1);
                break;
            case "updater":
            $scope.upload = Upload.upload({
                url: 'php/DeleteTeamMemeber.php',
                method: 'POST',
                data: {
                        projectid: pid,
                        teamid: model
                      }
            }).success(function(data, status, headers, config) {
              var rid = $scope.itemU.author.findIndex(x => x.team_id === model);
              $scope.disabledTM[$scope.itemU.author[rid].team_id] = false;
              $scope.itemU.author.splice(rid,1);
            }).error(function(data, status) {
                $scope.message.info[1].message = data;
            });
                break;
            default:
          }
        }


        $scope.addSI = function (itemid, nameofdb) {
          var rid = aCtrl.items[6].slide[0].findIndex(x => x.id === itemid);
          if (rid>=0 || itemid.id === null || !itemid) {
            return;
          }
          $http({
                method  : 'POST',
                url     : 'php/uploadSlideMemeber.php',
                data: {itemid: itemid, nofdb : nameofdb},
                headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
                 })
              .then(function(response) {
                aCtrl.items[6].slide[0].push(response.data.info[0].newitem[0]);
                var rid = aCtrl.items[6].slide[0].findIndex(x => x.id === itemid);
                $scope.disabledSI[aCtrl.items[6].slide[0][rid].id+aCtrl.items[6].slide[0][rid].title] = true;
              }, function(response) {
                 $scope.message.info[1].message = response.data;
            });
            }

      $scope.DeleteSI = function(itemid, nameofdb) {
          $http({
              url: 'php/deleteSlideMemeber.php',
              method: 'POST',
              data: {itemid: itemid, nofdb : nameofdb},
              headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(response) {
            var rid = aCtrl.items[6].slide[0].findIndex(x => x.id === itemid);
            $scope.disabledSI[aCtrl.items[6].slide[0][rid].id+aCtrl.items[6].slide[0][rid].title] = false;
            aCtrl.items[6].slide[0].splice(rid,1);
          }, function(response) {
             $scope.message.info[1].message = response.data;
          });
        }

        $scope.uCanTrust = function(string){
          return $sce.trustAsHtml(string);
        }

    };
    //************************************************//
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
      function ContactAddDirective () {
        return {
          templateUrl: 'src/template/contact-add.html'
          }
        }
      function ContactUpdateDirective () {
        return {
          templateUrl: 'src/template/contact-update.html'
                  }
        }
      function ProjectAddDirective () {
        return {
          templateUrl: 'src/template/project-add.html'
          }
        }
      function ProjectUpdateDirective () {
        return {
          templateUrl: 'src/template/project-update.html'
          }
        }
        function PaperAddDirective () {
          return {
            templateUrl: 'src/template/paper-add.html'
            }
          }
        function PaperUpdateDirective () {
          return {
            templateUrl: 'src/template/paper-update.html'
                    }
          }
          function TeamAddDirective () {
            return {
              templateUrl: 'src/template/team-add.html'
              }
            }
          function TeamUpdateDirective () {
            return {
              templateUrl: 'src/template/team-update.html'
                      }
            }
            function TeamcontactAddDirective () {
              return {
                templateUrl: 'src/template/teamcontact-add.html'
                }
              }
            function TeamcontactUpdateDirective () {
              return {
                templateUrl: 'src/template/teamcontact-update.html'
                        }
              }
})();
