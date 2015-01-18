angular.module('app')
	.config(function($locationProvider, $routeProvider) {

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		}).hashPrefix('!');
		$routeProvider
			.when('/material-sample', {
				templateUrl: '/examples/views/material.html',
				controller: 'app.controllers.app',
				controllerAs: 'AppCtrl'
			})
			.when('/basic-sample', {
				templateUrl: '/examples/views/basic.html',
				controller: 'app.controllers.app',
				controllerAs: 'AppCtrl'
			})
			.otherwise({redirectTo: '/material-sample'});
	});