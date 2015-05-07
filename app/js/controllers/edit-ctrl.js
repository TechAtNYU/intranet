'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $state, $interval, Restangular, apiDescriptor, formElementProvider) {
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

		console.log('Pre', finalModel);
		$scope.rdesc.attributes.fields.forEach(function(field) {
			if(field.validation.readOnly && field.name !== 'id') {
				delete finalModel.attributes[field.name];
			}
		});
		console.log('Post', finalModel);
		resource.patch(finalModel).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		}).catch(function(err) {
			alert('Could not submit to resource. API returned the following error: ' + err.data.errors[0].title);
		});
	};

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
	};

	// Fetches linked resources & 
	// store them in $scope.data for typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.attributes.fields, function(field){
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
				model.attributes[name] = _.pluck(linkage, 'id');
			} else {
				model.attributes[name] = linkage.id;
			}
		});

		return model;
	};

	// Transforms the linking fields on a model from being located at
	// model[field.name] to the required structure for linking resources
	// in the JSON API specification
	var relink = function(model, rdesc) {
		var links = {};

		_.each(rdesc.attributes.fields, function(field) {
			var fieldType = field.kind.name,
				fieldTargetType = field.kind.targetType,
				fieldArray = field.kind.isArray; 

			if(fieldType === 'Link') {
				var linkage = null;

				if(fieldArray) {
					linkage = _.map(model.attributes[field.name], function(value) {
						return {
							type: fieldTargetType,
							id: value
						};
					});
				} else if(model.attributes[field.name]) {
					linkage = {
						type: fieldTargetType,
						id: model.attributes[field.name]
					};
				} else {
					linkage = null;
				}

				links[field.name]  = { linkage: linkage };
				delete model.attributes[field.name];
			}
		});

		model.links = links;

		return model;
	};

	$scope.change = function(v) {
		console.log(v);
	};
});
