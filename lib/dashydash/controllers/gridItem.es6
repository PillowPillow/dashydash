angular.module('Dashydash')
	.controller('Dashydash.controllers.gridItem', [
	'PropertyBinder.services.binder', 
	'Dashydash.providers.gridItem',
	'$scope',
	function(bind, GridItem, $scope) {

		var bindings = [];

		this.item;
		this.$row;
		this.$width;
		this.$height;
		this.$col;


		this.config = {x:2,y:0,w:1,h:1};
		if($scope.config)
			this.config = $scope.config;



		this.class = {};

		this.initialize = (configuration) => {
			this.item = this._initializeItem(configuration);
			this.bindItemPositionProperties();
			this.bindItemSizeProperties();
			this.bindItemClassProperty();
		};

		$scope.$on('destroy', () => {
			this.item.destroy();
			this._destroyBindings();
		});

		this.bindItemPositionProperties = bindItemPositionPropertiesfn;
		this.bindItemSizeProperties = bindItemSizePropertiesfn;
		this.bindItemClassProperty = bindItemClassPropertyfn;
		this._destroyBindings = destroyBindingsfn;
		this._initializeItem = initializeItemfn;

		function bindItemPositionPropertiesfn(scope = this) {
			var binding = bind(['y','x'])
				.as({'y':'$row','x':'$col'})
				.from(this.item.position.current)
				.to(scope).apply()
				.onchange(() => this.item.grid.update(this.item));

			bindings.push(binding);
			return binding;
		}

		function bindItemSizePropertiesfn(scope = this) {
			var binding = bind(['w','h'])
				.as({'w':'$width','h':'$height'})
				.from(this.item.size.current)
				.to(scope).apply()
				.onchange(() => this.item.grid.update(this.item));

			bindings.push(binding);
			return binding;
		}

		function bindItemClassPropertyfn(scope = this) {
			var binding = bind('isDragged')
				.as('item-dragged')
				.from(this.item)
				.to(scope.class).apply();

			bindings.push(binding);
			return binding;
		}

		function destroyBindingsfn() {
			if(bindings.length === 0) return;

			for(var i = 0; i<bindings.length; i++)
				bindings[i].destroy();

			bindings.splice(0);
		}

		function initializeItemfn(configuration) {
			var item = new GridItem(configuration);
			item.attach(configuration.grid);
			return item;
		}

	}]);