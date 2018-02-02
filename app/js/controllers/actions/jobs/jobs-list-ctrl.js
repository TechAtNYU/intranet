"use strict";

angular
  .module("app.controllers")
  .controller(
    "JobsListCtrl",
    (
      $scope,
      $sce,
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

      $scope.jobIDtoAttr = {};

      $scope.selectionMode = selectionMode;
      Restangular.all(resourceName).getList().then(data => {
        $scope.data = data;
        if (resourceId) {
          const index = _.findIndex($scope.data, { id: resourceId });

          $scope.model = $scope.data[index];
        }

        _.each($scope.data, job => {
          // store all attributes for each job
          const attributes = {};

          // storing employer
          Restangular.one(`organizations/${job.relationships.employer.data.id}`)
            .get()
            .then(employer => {
              attributes.employer = employer.attributes.name;
              attributes.display = `${job.attributes.positionTitle} @ ${employer.attributes.name}`;
            })
            .then(() => {
              // storing url
              if (job.attributes.applicationUrl !== undefined) {
                const url = job.attributes.applicationUrl;

                attributes.url = `<a href=${url}>${url}</a>`;
              } else {
                attributes.url = "";
              }

              // storing categories
              const categories = job.attributes.categories;

              attributes.categories = categories.join(", ");
              // storing desired skills
              if (job.relationships.desiredSkills.data.length > 0) {
                const skills = [];

                job.relationships.desiredSkills.data.forEach(data => {
                  Restangular.one(`skills/${data.id}`).get().then(skill => {
                    skills.push(skill.attributes.name);
                    attributes.skills = skills.join(", ");
                  });
                });
              }
              $scope.jobIDtoAttr[job.id] = attributes;
            });
        });
      });

      $scope.updateSelection = function(newModelId) {
        const index = _.findIndex($scope.data, { id: newModelId });

        $scope.model = $scope.data[index];
        $state.transitionTo(
          "list",
          { id: newModelId, resourceName: resourceName },
          { notify: false }
        );
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
