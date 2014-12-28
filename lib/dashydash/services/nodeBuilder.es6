angular.module('Dashydash')
	.service('Dashydash.services.nodeBuilder', ['$compile', 
	function($compile) {

		var prototype = {};

		prototype.addAttributes = addAttributesfn;
		prototype.compile = compilefn;

		return prototype;

		function addAttributesfn(node, attributes = {}) {

			var keys = Object.keys(attributes),
				heDefinedAnAttribute = false;

			for(let i = 0; i<keys.length; i++)
				if(node.attr(keys[i]) === undefined) {
					node.attr(keys[i], attributes[keys[i]]);
					heDefinedAnAttribute = true;
				}

			return heDefinedAnAttribute;
		}

		function compilefn($node) {
			return $compile($node);
		}

	}]);