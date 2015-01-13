angular.module('Dashydash')
	.service('Dashydash.services.nodeBuilder', ['$compile', 
	function($compile) {

		var prototype = {};

		prototype.addAttributes = addAttributesfn;
		prototype.removeAttributes = removeAttributesfn;
		prototype.compile = compilefn;
		prototype.addClass = addClassfn;

		return prototype;

		function removeAttributesfn(node, attributes = []) {
			if(!(attributes instanceof Array))
				attributes = Object.keys(attributes);

			var attributeRemoved = false;

			for(let i = 0; i<attributes.length; i++)
				if(node.attr(attributes[i]) !== undefined) {
					node.removeAttr(attributes[i]);
					attributeRemoved = true;
				}
			return attributeRemoved;
		}

		function addAttributesfn(node, attributes = {}) {

			var keys = Object.keys(attributes),
				attributeDefined = false;

			for(let i = 0; i<keys.length; i++)
				if(node.attr(keys[i]) === undefined) {
					node.attr(keys[i], attributes[keys[i]]);
					attributeDefined = true;
				}

			return attributeDefined;
		}

		function compilefn($node) {
			return $compile($node);
		}

		function addClassfn(node, className='') {
			var domNode = node[0];
			var classAdded = false;
			if(!~domNode.className.indexOf(className)) {
				classAdded = true;
				domNode.className += ' ' + className;
			}
			return classAdded;
		}

	}]);