'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescriptor, formElementProvider) {
	$scope.data = {};

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data = loadLinkedData($scope.rdesc);
	});

	resource.get().then(function(data) {
		console.log(data);
		$scope.model = delink(data);
		console.log($scope.model);
	});

	$scope.updateResource = function(model, rdesc) {
		var finalModel = relink(angular.copy(Restangular.stripRestangular(model)), rdesc);
		console.log(finalModel);
		resource.patch(model);
	};

	// Fetches linked resources & 
	// store them in $scope.data for typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.fields, function(field){
			var fieldName = field.kind.name,
				fieldResourceType = field.kind.targetType; 

			if((fieldName === 'Link') && !(fieldResourceType in data)) {
				data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
			}
		});

		return data;
	};

	var delink = function(model) {
		var links = model.links;

		_.each(links, function(link, name) {
			var linkage = link.linkage;
			
			// This is primarily to omit the 'self' property
			if(!linkage) {
				return;
			} else if(_.isArray(linkage)) {
				model[name] = _.pluck(linkage, 'id');
			} else {
				model[name] = linkage.id;
			}
		});

		return model;
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
				} else {
					linkage = {
						type: fieldTargetType,
						id: model[field.name] || null
					};
				}

				links[field.name]  = { linkage: linkage };
				delete model[field.name];
			}
		});

		model.links = links;

		return model;
	};
});
