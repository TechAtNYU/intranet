'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescriptor, formElementProvider) {
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data = loadLinkedData($scope.rdesc);
	});

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	$scope.data = {};
	resource.get().then(function(data) {
		$scope.model = delink(data);
	});

	$scope.updateResource = function(model, rdesc) {
		var finalModel = relink(angular.copy(Restangular.stripRestangular(model)), rdesc);
		delete finalModel.modified;
		delete finalModel.created;

		console.log(finalModel);
		resource.patch(finalModel).then(function() {
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

	$scope.change = function(v) {
		console.log(v);
	};
});
