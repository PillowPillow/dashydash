angular.module('Dashydash')
	.directive('ddItemSource', function(){
		return {
			scope: {
				'grid': '@ddItemSource',
				'itemConfig': '=itemConfig',
				'onDragStart': '=?onDragStart',
				'onDrag': '=?onDrag',
				'onDragStop': '=?onDragStop'
			},
			restrict: 'A',
			controller: 'Dashydash.controllers.itemSource',
			controllerAs: 'ddItemSource',
			bindToController: true,
			link: function($scope, $node, attributes, ddItemSource) {

				ddItemSource.initialize($node);
			}
		};
	});