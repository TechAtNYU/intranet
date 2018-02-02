"use strict";

angular
  .module("app.controllers")
  .controller("MainCtrl", ($scope, apiDescriptor) => {
    apiDescriptor.then(apiDescription => {
      $scope.apidesc = apiDescription.data;
    });
  });
