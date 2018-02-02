"use strict";

angular
  .module("app.controllers")
  .controller(
    "ReimbursementsEditCtrl",
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
      const resourceId = $stateParams.id;

      const resource = Restangular.one(resourceName, resourceId);

      $scope.fep = formElementProvider;

      $scope.data = {};
      resource.get().then(data => {
        apiDescriptor.then(apiDescription => {
          $scope.rdesc = apiDescription.resource(resourceName);
          $scope.data = dataTransformer.loadLinkedData(
            $scope.rdesc,
            $scope.refreshData
          );
        });
        $scope.model = dataTransformer.delink(data);
      });

      $scope.updateResource = function(model, rdesc) {
        dataTransformer.updateResource(model, rdesc, resource).then(data => {
          $state.go("list", {
            resourceName: resourceName,
            selectionMode: "single",
            id: data.id
          });
        });
      };

      $scope.refreshData = function(data, fieldResourceType) {
        data[fieldResourceType] = Restangular.all(
          fieldResourceType
        ).getList().$object;
      };
    }
  );
