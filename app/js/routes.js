
angular.module('app')
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	// TODO: Enable this when server is properly configured
	// $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'partials/index.html',
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
			controller: 'ListCtrl'
		})
		.state('add', {
			url: '/r/:resourceName/add',
			templateUrl: 'partials/actions/add.html',
			controller: 'AddCtrl'
		})
		.state('edit', {
			url: '/r/:resourceName/edit/:id',
			templateUrl: 'partials/actions/edit.html',
			controller: 'EditCtrl'
		});
});
