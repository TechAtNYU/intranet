'use strict';

angular
.module('app.controllers')
.controller('AddCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescriptor, formElementProvider) {
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data = loadLinkedData($scope.rdesc);
	});

	var resourceName = $stateParams.resourceName;

	var resource = Restangular.all(resourceName);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.model = {};

	$scope.updateResource = function(model, rdesc) {
		var finalModel = relink(angular.copy(Restangular.stripRestangular(model)), rdesc);
		delete finalModel.modified;
		delete finalModel.created;
		finalModel.type = rdesc.id;

		console.log(finalModel);
		resource.post(finalModel).then(function() {
			alert('Successfully submitted!');
		}).catch(function(err) {
			alert('Could not submit to resource. API returned the following error: ' + err);
		});
	};

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
	};

	// Fetches linked resources & 
	// store them in $scope.data for typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.fields, function(field){
			var fieldName = field.kind.name,
				fieldResourceType = field.kind.targetType; 

			if((fieldName === 'Link') && !(fieldResourceType in data)) {
				$scope.refreshData(data, fieldResourceType);
			}
		});

		return data;
	};

	// Transforms the linking fields on a model from being located at
	// model[field.name] to the required structure for linking resources
	// in the JSON API specification
	var relink = function(model, rdesc) {
		var links = {};

		_.each(rdesc.fields, function(field) {
			var fieldType = field.kind.name,
				fieldTargetType = field.kind.targetType,
				fieldArray = field.kind.isArray; 

			if(fieldType === 'Link') {
				var linkage = null;

				if(fieldArray) {
					linkage = _.map(model[field.name], function(value) {
						return {
							type: fieldTargetType,
							id: value
						};
					});
				} else if(model[field.name]) {
					linkage = {
						type: fieldTargetType,
						id: model[field.name]
					};
				} else {
					linkage = null;
				}

				links[field.name]  = { linkage: linkage };
				delete model[field.name];
			}
		});

		model.links = links;

		return model;
	};
});