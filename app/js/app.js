'use strict';

angular.module('app.services', ['restangular']);
angular.module('app.controllers', ['app.services']);

angular.module('app', [
	'ngSanitize',
	'ui.router',
	'ui.bootstrap',
	'ui.tinymce',
	'restangular',
	'localytics.directives',
	'app.filters',
	'app.services',
	'app.directives',
	'app.controllers',
]).config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('https://api.tnyu.org/v3-test');

	// Configuring Restangular to work with JSONAPI spec
	RestangularProvider.setDefaultHeaders({
		'Accept': 'application/vnd.api+json, application/*, */*',
		'Content-Type': 'application/vnd.api+json'
	});

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		if (operation === 'remove') {
			return null;
		}
		return data.data;
	});

	//called before sending any data to the server
	RestangularProvider.addRequestInterceptor(function(data, operation, what, url) {
		if (operation === 'remove') {
			return null;
		}
		return {data: data};
	});

	//called after we get a response from the server
	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		var flattenTree = function(resource) {
			var flatten = function(object, parentKey) {
				if (_.isObject(object) && !_.isArray(object)) {
					Object.keys(object).forEach(function(key) {
						flatten(object[key], parentKey + '.' + key);
					});
				} else {
					resource[parentKey] = object;
				}
			};

			Object.keys(resource).forEach(function(key) {
				flatten(resource[key], key);
			});
		};

		if (data === null) {
			return null;
		} else if (_.isArray(data)) {
			_.pluck(data, 'attributes').forEach(flattenTree);
		} else {
			flattenTree(data.attributes);
		}
		return data;
	});

	RestangularProvider.addRequestInterceptor(function(data, operation, what, url) {
		// 'deepening' to perform before sending out any request data.
		// This reverses the above flattening process.
		if (operation === 'getList' || operation === 'get') {
			return data;
		}

		_.forOwn(data, function(value, key) {
			var tokens = key.split('.');
			if (tokens.length > 1) {
				var p = data;
				for (var i = 0; i < tokens.length; ++i) {
					var t = tokens[i];
					if (!p[t]) {
						p[t] = {};
					}
					if (i === tokens.length - 1) {
						p[t] = value;
					} else {
						p = p[t];
					}
				}
				delete data[key];
			}
		});
		return data;
	});

}).config(function(datepickerConfig) {
	datepickerConfig.showWeeks = false;
});
