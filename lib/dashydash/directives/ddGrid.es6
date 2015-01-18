angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {
				'gridId': '@gridId',
				'configuration': '=?configuration',
				'addItemMethod': '=?onAddItem'
			},
			restrict: 'AE',
			transclude: true,
			templateUrl: 'ddGrid.jade',
			require: 'ddGrid',
			controller: 'Dashydash.controllers.grid',
			controllerAs: 'ddGrid',
			bindToController: true,
			compile: () => {
				return {
					pre: ($scope, $node, attributes, controller) => {
						var configuration = $scope.configuration || {};
						configuration.element = $node;
						configuration.id = $scope.gridId;
						controller.initialize(configuration);
					}
				};
			}
		};
	});