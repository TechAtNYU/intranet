"use strict";

angular
  .module("app.controllers")
  .controller(
    "PersonAddCtrl",
    (
      $scope,
      $rootScope,
      $stateParams,
      $state,
      $interval,
      Restangular,
      apiDescriptor,
      formElementProvider,
      dataTransformer
    ) => {
      const resourceName = $stateParams.resourceName;

      const resource = Restangular.all(resourceName);

      $scope.fep = formElementProvider;

      $scope.data = {};
      $scope.model = { attributes: {} };

      apiDescriptor.then(apiDescription => {
        $scope.rdesc = apiDescription.resource(resourceName);
        $scope.data = dataTransformer.loadLinkedData(
          $scope.rdesc,
          $scope.refreshData
        );
      });

      $scope.createResource = function(model, rdesc) {
        dataTransformer.createResource(model, rdesc, resource).then(data => {
          $state.go("list", {
            resourceName: resourceName,
            selectionMode: "single",
            id: data.id
          });
        });
      };

      // data: array of array type data
      // fieldResourceType: which field to grab
      $scope.refreshData = function(data, fieldResourceType) {
        data[fieldResourceType] = Restangular.all(
          fieldResourceType
        ).getList().$object;
      };
    }
  );
