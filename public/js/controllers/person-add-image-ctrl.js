'use strict';

angular
.module('app.controllers')
.controller('PersonAddImageCtrl', function($scope, $http) {
  $scope.setFile = function(files) {
    $scope.file = files ? files[0] : undefined;
  }

  $scope.uploadFile = function(file) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("upload", file);

    $http.post('http://services.tnyu.org/upload', fd, {
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function(data) {
      console.log(data);
      $scope.$parent.formData.imageUrl = data.filePath;
    }).error(function(status, error) {
      console.log(status, error);
    });
  };
});