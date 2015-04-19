'use strict';

angular
.module('app.controllers')
.controller('AddCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescriptor, formElementProvider) {
	// TODO: EditCtrl and AddCtrl should 
	// share loadLinkedData & relink.  

	var resourceName = $stateParams.resourceName;
	var resource     = Restangular.all(resourceName);

	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data  = loadLinkedData($scope.rdesc);
	});

	$scope.fep   = formElementProvider;
	$scope.data  = {};
	$scope.model = {};

	// TODO: change method name 
	// to createResource 
	$scope.updateResource = function(model, rdesc) {
		var finalModel = 
			relink(
				angular.copy(Restangular.stripRestangular(model)), 
				rdesc
			);

		delete finalModel.modified;
		delete finalModel.created;

		finalModel.type = rdesc.id;

		console.log(finalModel);

		resource.post(finalModel)
			.then(function() {
				alert('Successfully submitted!');
			}).catch(function(err) {
				alert(
					'Could not submit to resource. API returned the following error: '+ 
					err
				);
			});
	};

	// Fetch linked resources for the typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.fields, function(field){
			var fieldName         = field.kind.name,
				  fieldResourceType = field.kind.targetType; 

			if((fieldName === 'Link') && 
				!(fieldResourceType in data)) {

					data[fieldResourceType] = 
						Restangular.all(fieldResourceType).getList().$object; 
			}
		});

		return data;
	};

	// Transforms linking fields to 
	// match JSON API specification 
	var relink = function(model, rdesc) {
		var links = {};

		_.each(rdesc.fields, function(field) {
			var fieldType       = field.kind.name,
				  fieldTargetType = field.kind.targetType,
				  fieldIsArray 		= field.kind.isArray; 

			var linkage; 

			if(fieldType === 'Link') {

				if(fieldIsArray) {
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
