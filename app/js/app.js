'use strict';

angular.module('app.controllers', []);

angular.module('app', [
	'ngSanitize',
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker',
	'restangular',
	'localytics.directives',
	'app.filters',
	'app.services',
	'app.directives',
	'app.controllers',
]).config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('https://api.tnyu.org/v2');

	// Configuring Restangular to work with JSONAPI spec
	RestangularProvider.setDefaultHeaders({
		'Accept': 'application/vnd.api+json, application/*, */*',
		'Content-Type': 'application/vnd.api+json; ext=bulk'
	});

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		return data.data;
	});

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		var flattenTree = function(resource) {
			var flatten = function(object, parentKey) {
				if(_.isObject(object) && !_.isArray(object)) {
					Object.keys(object).forEach(function(key) {
						flatten(object[key], parentKey + '.' + key);
					});
				} else {
					resource[parentKey] = object;
				}
			};

			Object.keys(resource).forEach(function(key) {
				if(key === 'links') {
					return;
				} else if(!_.isArray(resource[key])) {
					flatten(resource[key], key);
				}
			});
		};

		if(_.isArray(data)) {
			data.forEach(flattenTree);
		} else {
			flattenTree(data);
		}
		return data;
	});

	RestangularProvider.addRequestInterceptor(function(data, operation, what, url) {
		// 'deepening' to perform before sending out any request data.
		// This reverses the above flattening process.

		if(operation === 'getList' || operation === 'get') {
			return data;
		}

		_.forOwn(data, function(value, key) {
			var tokens = key.split('.');
			if(tokens.length > 1) {
				var p = data;
				for(var i = 0; i < tokens.length; ++i) {
					var t = tokens[i];
					if(!p[t]) {
						p[t] = {};
					}
					if(i === tokens.length - 1) {
						console.log('\t=>', p);
						p[t] = value;
					} else {
						p = p[t];
					}
				}
			}
		});

		return data;
	});
}).config(function (datepickerConfig) {
	datepickerConfig.showWeeks = false;
}).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	// TODO: Enable this when server is properly configured
	// $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'partials/index/index.html',
			controller: 'MainCtrl',
			resolve: {
				apiDescription: function(Restangular) {
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
				}
			}
		})
		.state('list', {
			url: '/r/:resourceName/list/:selectionMode',
			templateUrl: 'partials/actions/list.html',
			controller: 'ListCtrl',
			resolve: {
				apiDescription: function(Restangular) {
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
				}
			}
		})
		.state('add', {
			url: '/r/:resourceName/add',
			templateUrl: 'partials/actions/add.html',
			controller: 'AddCtrl',
			resolve: {
				apiDescription: function(Restangular) {
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
				}
			}
		})
		.state('edit', {
			url: '/r/:resourceName/edit/:id',
			templateUrl: 'partials/actions/edit.html',
			controller: 'EditCtrl',
			controllerAs: 'ctrl',
			resolve: {
				apiDescription: function(Restangular) {
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
				}
			}
		});
});
