"use strict";

angular
  .module("app.controllers")
  .controller(
    "PersonListCtrl",
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

      $scope.personIDtoAttr = {};

      $scope.selectionMode = selectionMode;
      Restangular.all(resourceName).getList().then(data => {
        $scope.data = data;
        if (resourceId) {
          const index = _.findIndex($scope.data, { id: resourceId });

          $scope.model = $scope.data[index];
        }

        // mapping personID to name, position and display information
        _.each($scope.data, person => {
          const personData = {};
          // getting roles

          if (
            person.attributes.roles != null &&
            person.attributes.roles.length > 0
          ) {
            personData.roles = person.attributes.roles.join(", ");
          }

          // getting currentEmployer
          if (person.relationships.currentEmployer.data != null) {
            Restangular.one(
              `organizations/${person.relationships.currentEmployer.data.id}`
            )
              .get()
              .then(org => {
                personData.currentEmployer = org.attributes.name;
              });
          }

          // getting schools
          const schools = [];

          if (
            person.relationships.schools.data != null &&
            person.relationships.schools.data.length > 0
          ) {
            person.relationships.schools.data.forEach(school => {
              Restangular.one(`school-attendances/${school.id}`)
                .get()
                .then(data => {
                  schools.push(data.attributes.schoolName);
                  personData.schools = schools.join(", ");
                });
            });
          }

          // get skills
          const skills = [];

          if (
            person.relationships.skills.data != null &&
            person.relationships.skills.data.length > 0
          ) {
            person.relationships.skills.data.forEach(skill => {
              Restangular.one(`skills/${skill.id}`).get().then(data => {
                skills.push(data.attributes.name);
                personData.skills = skills.join(", ");
              });
            });
          }

          // get wantsToLearn
          const learn = [];

          if (
            person.relationships.wantsToLearn.data != null &&
            person.relationships.wantsToLearn.data.length > 0
          ) {
            person.relationships.wantsToLearn.data.forEach(name => {
              Restangular.one(`skills/${name.id}`).get().then(data => {
                learn.push(data.attributes.name);
                personData.learn = learn.join(", ");
              });
            });
          }

          // get wantsToHire
          const hire = [];

          if (
            person.relationships.wantsToHire.data != null &&
            person.relationships.wantsToHire.data.length > 0
          ) {
            person.relationships.wantsToHire.data.forEach(name => {
              Restangular.one(`skills/${name.id}`).get().then(data => {
                hire.push(data.attributes.name);
                personData.wantsToHire = hire.join(", ");
              });
            });
          }

          // get image url
          let imgURL = "";

          if (
            person.attributes.imgUrl != null ||
            person.attributes.imgUrl != undefined
          ) {
            const url = person.attributes.imgUrl;

            imgURL = `<a href="${url}">${url}</a>`;
            personData.imgURL = imgURL;
          }

          $scope.personIDtoAttr[person.id] = personData;
        }); // end for each loop
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
