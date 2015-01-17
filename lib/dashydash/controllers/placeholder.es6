angular.module('Dashydash')
	.controller('Dashydash.controllers.placeholder', [
	'PropertyBinder.services.binder', 
	'Dashydash.providers.placeholder',
	function(bind, Placeholder) {
		
		var bindings = [];

		this.class = {};

		this.initialize = (configuration) => {
			this.placeholder = new Placeholder(configuration);
			configuration.grid.placeholder = this.placeholder;
			this.bindPlaceholderProperties();
			return this.placeholder;
		};

		this.bindPlaceholderProperties = bindPlaceholderPropertiesfn;
		this.bindPlaceholderPositionProperties = bindPlaceholderPositionPropertiesfn;
		this.bindPlaceholderSizeProperties = bindPlaceholderSizePropertiesfn;
		this.bindPlaceholderClassProperty = bindPlaceholderClassPropertyfn;
		this._destroyBindings = destroyBindingsfn;

		function bindPlaceholderPropertiesfn(scope = this) {
			this.bindPlaceholderPositionProperties(scope);
			this.bindPlaceholderSizeProperties(scope);
			this.bindPlaceholderClassProperty(scope);
		}

		function bindPlaceholderPositionPropertiesfn(scope = this) {
			var binding = bind(['y','x'])
				.as({'y':'$row','x':'$col'})
				.from(this.placeholder.position.current)
				.to(scope).apply();

			bindings.push(binding);
			return binding;
		}

		function bindPlaceholderSizePropertiesfn(scope = this) {
			var binding = bind(['w','h'])
				.as({'w':'$width','h':'$height'})
				.from(this.placeholder.size.current)
				.to(scope).apply();

			bindings.push(binding);
			return binding;
		}

		function bindPlaceholderClassPropertyfn(scope = this) {
			var binding = bind('itemDragged')
				.as('item-dragged')
				.from(this.placeholder)
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
	}]);