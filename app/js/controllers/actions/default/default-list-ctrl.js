'use strict';

angular
  .module('app.controllers')
  .controller('DefaultListCtrl', function(
    $scope,
    $rootScope,
    $stateParams,
    $state,
    Restangular,
    apiDescriptor,
    dataTransformer,
    preProcess
  ) {
    const resourceName = $stateParams.resourceName;
    const resourceId = $stateParams.id;
    $scope.resourceName = resourceName;
    apiDescriptor.then(function(apiDescription) {
      $scope.rdesc = apiDescription.resource(resourceName);
    });

    let selectionMode = $stateParams.selectionMode;
    if (
      !selectionMode ||
      (selectionMode !== 'single ' && selectionMode !== 'multiple')
    ) {
      selectionMode = 'multiple';
    }

    $scope.selectionMode = selectionMode;
    Restangular.all(resourceName)
      .getList()
      .then(function(data) {
        $scope.data = data;
        if (resourceId) {
          $scope.model = _.find($scope.data, {id: resourceId});
        }
        _.each($scope.data, function(element) {
          element = preProcess.convertTimeAttributes(element);
        });
      });

    $scope.updateSelection = function(newModelId) {
      //$state.go("list", {id: newModelId});
      $state.transitionTo('list', {id: newModelId}, {notify: false});
    };

    $scope.deleteResource = function(id) {
      dataTransformer.deleteResource($scope.resourceName, id).then(function() {
        alert('Successfully deleted this entry');
        $scope.data = Restangular.all($scope.resourceName).getList().$object;
        $scope.model = {};
        $state.transitionTo(
          'list',
          {resourceName: $scope.resourceName},
          {
            inherit: false,
            notify: false,
            reload: true,
          }
        );
      });
    };
  });
