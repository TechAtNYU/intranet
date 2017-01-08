'use strict';

angular.module('app')
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	// TODO: Enable this when server is properly configured
	// $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'partials/index.html',
			controller: 'MainCtrl'
		})
		.state('list', {
			url: '/r/:resourceName/list/:id?selectionMode',
			templateUrl: 'partials/actions/action.html',
			controller: 'ActionCtrl',
			data: {
				action: 'list'
			}
		})
		.state('add', {
			url: '/r/:resourceName/add',
			templateUrl: 'partials/actions/action.html',
			controller: 'ActionCtrl',
			data: {
				action: 'add'
			}
		})
		.state('edit', {
			url: '/r/:resourceName/edit/:id',
			templateUrl: 'partials/actions/action.html',
			controller: 'ActionCtrl',
			data: {
				action: 'edit'
			}
		});
});
