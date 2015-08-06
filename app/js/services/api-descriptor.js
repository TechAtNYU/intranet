angular
.module('app.services')
.factory('apiDescriptor', function(Restangular) {
	'use strict';

	return Restangular.all('').getList()
		.then(function(data) {
			// sort the resource types in abc order
			// the ids below are strings (names of resource types)
			data = data.sort(function(a, b) {
				return a.id > b.id ? 1 : -1;
			})

			data = {
				data: data,
				resource: function(name) {
					return _.find(data.data, function(r) {
						return r.id === name;
					});
				}
			};
			return data;
		});
});
