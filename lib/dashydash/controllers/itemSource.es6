angular.module('Dashydash')
	.controller('Dashydash.controllers.itemSource', [
	'Dashydash-utils.services.utils', 
	'Dashydash-utils.providers.draggable', 
	'Dashydash-utils.constants.draggableConfiguration', 
	'Dashydash.constants.itemConfig', 
	'$rootScope',
	'Dashydash.services.grid',
	'Dashydash.providers.gridItem',
	function(utils, Draggable, DRAGGABLE_CONFIGURATION, ITEM_CONFIGURATION, $rootScope, gridService, GridItem) {

		var ghost, grid, item, self = this;

		this.initialize = function($node) {
			var configuration = getConfiguration($node);

			this.draggable = new Draggable(configuration);

			this.draggable.enable();
			return this.draggable;
		};

		this.registerGhost = ($node) => ghost = $node;

		function updateView() {
			$rootScope.$apply();
		}

		function getConfiguration($node) {

			var configuration = {
				element: $node, 
				ondrag: (...args) => onDrag(...args), 
				ondragStart: (...args) => onDragStart(...args), 
				ondragStop: (...args) => onDragStop(...args)
			};
			utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);

			configuration.ghost = ghost || configuration.element;
			return configuration;
		}

		function onDrag(...args) {
			var overlapped = gridService.getOverlapped(args[0]);

			if(overlapped.length > 0) {
				grid = overlapped[0];

				if(!item.isAttachedTo(grid)) {
					item.attach(grid, false);
					item.$$ondragStart(...args);
					self.onDragStart && self.onDragStart(...args);
					updateView();
				} 
				else {
					item.$$ondrag(...args);
					self.onDrag && self.onDrag(...args);
					updateView();
				}


			}
			else {
				if(item && item.isAttached) {
					item.destroy();
					if(grid) updateView();
				}
				grid = undefined;
			}
		}

		function onDragStart(...args) {
			grid = undefined;
			item = new GridItem( self.itemConfig || ITEM_CONFIGURATION );
			self.onDragStart && self.onDragStart(...args);
			updateView();
		}

		function onDragStop(...args) {
			item.destroy();
			if(grid) {
				grid.addItem(item.serialize());
				updateView();
			}
			item = undefined;
			self.onDragStop && self.onDragStop(...args);
		}

	}]);