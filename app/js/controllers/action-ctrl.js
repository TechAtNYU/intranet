"use strict";

angular
  .module("app.controllers")
  .controller(
    "ActionCtrl",
    ($scope, $stateParams, $state, apiDescriptor, pageProvider) => {
      const resourceName = $stateParams.resourceName;

      $scope.action = $state.current.data.action;
      $scope.resourceName = resourceName;

      $scope.pp = pageProvider;

      apiDescriptor.then(apiDescription => {
        $scope.rdesc = apiDescription.resource(resourceName);
      });
    }
  );
