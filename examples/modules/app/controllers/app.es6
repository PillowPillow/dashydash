angular.module('app')
	.controller('app.controllers.app', ['$location', function($location) {

		this.route = (path) => $location.path(path);
		this.swapRoute = () => $location.path( $location.path() === '/material-sample' ? '/basic-sample' : '/material-sample' );
	}]);





