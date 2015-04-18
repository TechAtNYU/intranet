'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescription, formElementProvider) {
	$scope.data = {};

	var resourceName = $stateParams.resourceName, 
				resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.rdesc = apiDescription.resource(resourceName);
	$scope.fep = formElementProvider;

	// Fetch linked resources & 
	// store them in $scope.data for typeahead
	
	_.each($scope.rdesc.fields, function(field){

		var fieldName = field.kind.name,
			fieldResourceType = field.kind.targetType; 

		if((fieldName === 'Link') &&
			!(fieldResourceType in $scope.data)){
			$scope.data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
		} 
	});

	resource.get().then(function(data) {
		$scope.model = delink(data);
	});
	// $interval(function() { console.log($scope.model); }, 500);

	$scope.updateResource = function() {
		var finalModel = relink(angular.copy(Restangular.stripRestangular($scope.model)), $scope.rdesc);
		console.log(finalModel);
		resource.patch($scope.model);
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

	$scope.change = function() {
		console.log($scope.model);
	};
});
