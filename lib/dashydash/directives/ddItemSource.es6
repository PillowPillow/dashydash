angular.module('Dashydash')
	.directive('ddItemSource', function(){
		return {
			scope: {
				grid: '@',
				itemConfig: '=itemConfig',
				itemTemplate: '=itemTemplate'
			},
			restrict: 'A',
			controller: 'Dashydash.controllers.itemSource',
			controllerAs: 'ddItemSource',
			bindToController: true,
			link: function($scope, $node, attributes, controller) {
				console.log(controller.grid, controller.itemConfig, controller.itemTemplate);
			}
		};
	});