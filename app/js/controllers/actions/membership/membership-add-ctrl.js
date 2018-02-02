"use strict";

angular
  .module("app.controllers")
  .controller(
    "MembershipAddCtrl",
    (
      $scope,
      $rootScope,
      $stateParams,
      $state,
      $interval,
      formatTeamDisplayFilter,
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

      const teamsIdToName = {};

      $scope.positionIdToName = {};

      // mapping teamID to teamName
      Restangular.one("teams").getList().then(teams => {
        _.each(teams, element => {
          teamsIdToName[element.id] = element.attributes.name;
        });

        // mapping positionID to names
        Restangular.one("positions").getList().then(position => {
          _.each(position, element => {
            const isLead = element.attributes.isLead;
            const teamName = teamsIdToName[element.relationships.team.data.id];

            $scope.positionIdToName[element.id] = formatTeamDisplayFilter(
              teamName,
              isLead
            );
            $scope.refreshData(
              $scope.data,
              $scope.rdesc.attributes.fields[1].kind["target-type"]
            );
          });
        });
      });

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
