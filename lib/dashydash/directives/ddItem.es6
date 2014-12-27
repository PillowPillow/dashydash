angular.module('Dashydash')
	.directive('ddItem', function(){
		return {
			scope: {
				col: '=?ddItemColumn',
				row: '=?ddItemRow',
				width: '=?ddItemWidth',
				height: '=?ddItemHeight'
			},
			require: ['^ddGrid', 'ddItem'],
			restrict: 'EA',
			templateUrl: 'ddItem.jade',
			transclude: true,
			controller: ['Dashydash-utils.services.utils', 'Dashydash.providers.item', 
			function(utils, Item) {

				this.initialize = function(configuration = {}) {
					this.item = new Item(configuration);
					return this.item;
				};


			}],
			controllerAs: '_ddItem',
			link: function($scope, $node, attributes, controllers) {

				console.log(controllers);

				var gridController = controllers[0],
					itemController = controllers[1];





				var config = {element: $node, grid: gridController.grid, rows: $scope.row, columns: $scope.col};

				itemController.initialize(config);

			}
		};
	});