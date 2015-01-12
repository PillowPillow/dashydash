angular.module('Dashydash')
	.service('Dashydash.services.nodeBuilder', ['$compile', 
	function($compile) {

		var prototype = {};

		prototype.addAttributes = addAttributesfn;
		prototype.removeAttributes = removeAttributesfn;
		prototype.compile = compilefn;
		prototype.addClass = addClassfn;
		prototype.removeClass = removeClassfn;

		return prototype;

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

		function removeAttributesfn(node, attributes = {}) {
			var keys = Object.keys(attributes),
				attributeRemoved = false;

			for(let i = 0; i<keys.length; i++)
				if(node.attr(keys[i]) !== undefined) {
					node.removeAttr(keys[i]);
					attributeRemoved = true;
				}

			return attributeRemoved;
		}

		function compilefn($node) {
			return $compile($node);
		}

		function addClassfn(node, className='') {
			var classAdded = false;

			if(~node[0].className.indexOf(className)) {
				classAdded = true;
				node[0].className += ' ' + className;
			}

			return classAdded;
		}

		function removeClassfn(node, className='') {
			var classRemoved = false;

			var index = node[0].className.indexOf(className),
				classes = node[0].className;
			if(!~index) {
				classRemoved = true;
				node[0].className = classes.slice(0, index) + classes(index + className.length);
			}

			return classRemoved;
		}

	}]);