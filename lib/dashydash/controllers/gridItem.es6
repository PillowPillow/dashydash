angular.module('Dashydash')
	.controller('Dashydash.controllers.gridItem', [
	'PropertyBinder.services.binder', 
	'Dashydash.providers.gridItem',
	'$scope',
	function(bind, GridItem, $scope) {

		var bindings;

		this.item;
		this.row;
		this.width;
		this.height;
		this.col;

		this.class = {};

		this.initialize = (configuration) => {
			this.item = this._initializeItem(configuration);
			this.bindItemProperties();
		};

		$scope.$on('destroy', () => {
			this.item.destroy();
			this._destroyBindings();
		});

		this.bindItemProperties = bindItemPropertiesfn;
		this._destroyBindings = destroyBindingsfn;
		this._initializeItem = initializeItemfn;

		function bindItemPropertiesfn(scope = this) {
			bind(['y','x'])
				.as({'y':'row','x':'col'})
				.from(this.item.position.current)
				.to(scope).apply()
				.onchange(() => this.item.grid.update(this.item));
			bind(['w','h'])
				.as({'w':'width','h':'height'})
				.from(this.item.size.current)
				.to(scope).apply()
				.onchange(() => this.item.grid.update(this.item));
			bind('isDragged')
				.as('item-dragged')
				.from(this.item)
				.to(scope.class).apply();

			return bindings;
		}

		function destroyBindingsfn() {
			if(!bindings) return;

			var keys = Object.keys(bindings);
			for(var i = 0; i<keys.length; i++)
				bindings[keys[i]].destroy();

			bindings = undefined;
		}

		function initializeItemfn(configuration) {
			var item = new GridItem(configuration);
			item.attach(configuration.grid);
			console.log(item)
			return item;
		}

	}]);