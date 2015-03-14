'use strict';

angular.module('app.controllers', []);

angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'multi-select',
  'restangular',
  'app.controllers',
  'app.filters',
  'app.services',
  'app.directives',
]).config(function (datepickerConfig) {
  datepickerConfig.showWeeks = false;
}).config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('https://api.tnyu.org/v1.0');

	// Configuring Restangular to work with JSONAPI spec
	RestangularProvider.setDefaultHeaders({
		'Content-Type': 'application/vnd.api+json; charset=utf-8'
	});

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		return data[Object.keys(data)[0]]; // Return the first child of the returned data
	});
});
