'use strict';

angular.module('app.controllers', []);

angular.module('app', [
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'multi-select',
  'restangular',
  'app.controllers',
  'app.filters',
  'app.services',
  'app.directives',
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
    console.log(data);

    var flattenTree = function(resource) {
      console.log(resource);
      var flatten = function(object, parentKey) {
        console.log(object);
        if(_.isObject(object)) {
          Object.keys(object).forEach(function(key) {
            flatten(object[key], parentKey + '.' + key);
          });
        } else {
          console.log(parentKey);
          resource[parentKey] = object;
        }
      };

      Object.keys(resource).forEach(function(key) {
        console.log(key);
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
    console.log(data);
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
      controller: 'MainCtrl'
    })
    .state('list', {
      url: 'r/:resourceName/list/:selectionMode',
      templateUrl: 'partials/actions/list.html',
      controller: 'ListCtrl',
      resolve: {
        apiDescription: function($http) {
          return $http.get('/data/resource-description.json');
        }
      }
    })
    .state('add', {
      url: 'r/:resourceName/add',
      templateUrl: 'partials/actions/add.html',
      controller: 'AddCtrl',
      resolve: {
        apiDescription: function($http) {
          return $http.get('/data/resource-description.json');
        }
      }
    })
    .state('edit', {
      url: 'r/:resourceName/edit/:id',
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
