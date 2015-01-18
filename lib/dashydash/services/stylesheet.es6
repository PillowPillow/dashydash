angular.module('Dashydash')
	.service('Dashydash.services.stylesheet', function(){
		
		var stylesheet, prototype = {};

		prototype.generate = generateStylesheetfn;

		return prototype;

		function generateStylesheetfn() {
			stylesheet = document.createElement("style");

			// WebKit hack [thanks to gridstack]
			stylesheet.appendChild(document.createTextNode(""));

			document.head.appendChild(stylesheet);

			return stylesheet.sheet;
		}
	});