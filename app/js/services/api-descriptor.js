'use strict';

angular
.module('app.services')
.factory('apiDescriptor', function(Restangular) {
	return Restangular.all('').getList()
		.then(function(data) {
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