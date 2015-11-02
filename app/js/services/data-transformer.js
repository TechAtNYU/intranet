angular
.module('app.services')
.factory('dataTransformer', function() {
	'use strict';

	return {
		// Transforms the linking fields on a model from being located at
		// model[field.name] to the required structure for linking resources
		// in the JSON API specification
		relink: function(model, rdesc) {
			var links = {};

			_.each(rdesc.attributes.fields, function(field) {
				var fieldType = field.kind["base-type"],
					fieldTargetType = field.kind["target-type"],
					fieldArray = field.kind["is-array"];

				if(fieldType === 'Relationship') {
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

					links[field.name]  = { data: linkage };
					delete model.attributes[field.name];
				}
			})

			//changed from model.links to relationships
			model.relationships = links;

			return model;
		},
		// The inverse of the above transformation; given a model in JSON API
		// format, takes all elements in its links property and makes them into
		// a normal, flat object
		delink: function(model) {
			var links = model.relationships;

			_.each(links, function(link, name) {
				var linkage = link.data;

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
		}
	};
});
