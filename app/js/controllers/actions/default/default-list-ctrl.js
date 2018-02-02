"use strict";

angular
  .module("app.controllers")
  .controller(
    "DefaultListCtrl",
    (
      $scope,
      $rootScope,
      $stateParams,
      $state,
      Restangular,
      apiDescriptor,
      dataTransformer
    ) => {
      const resourceName = $stateParams.resourceName;
      const resourceId = $stateParams.id;

      $scope.resourceName = resourceName;
      apiDescriptor.then(apiDescription => {
        $scope.rdesc = apiDescription.resource(resourceName);
      });

      let selectionMode = $stateParams.selectionMode;

      if (
        !selectionMode ||
        (selectionMode !== "single " && selectionMode !== "multiple")
      ) {
        selectionMode = "multiple";
      }

      $scope.selectionMode = selectionMode;
      Restangular.all(resourceName).getList().then(data => {
        $scope.data = data;
        if (resourceId) {
          $scope.model = _.find($scope.data, { id: resourceId });
        }
      });

      $scope.updateSelection = function(newModelId) {
        // $state.go("list", {id: newModelId});
        $state.transitionTo("list", { id: newModelId }, { notify: false });
      };

      $scope.deleteResource = function(id) {
        dataTransformer.deleteResource($scope.resourceName, id).then(() => {
          alert("Successfully deleted this entry");
          $scope.data = Restangular.all($scope.resourceName).getList().$object;
          $scope.model = {};
          $state.transitionTo(
            "list",
            { resourceName: $scope.resourceName },
            {
              inherit: false,
              notify: false,
              reload: true
            }
          );
        });
      };
    }
  );
