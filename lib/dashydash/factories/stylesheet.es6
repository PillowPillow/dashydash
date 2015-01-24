angular.module('Dashydash')
	.factory('Dashydash.factories.stylesheet', ['$document', function($document) {
			
			return generateStylesheetfn;

			function generateStylesheetfn() {
				var stylesheet = $document[0].createElement('style');
	
				// WebKit hack [thanks to gridstack]
				stylesheet.appendChild($document[0].createTextNode(''));
	
				$document[0].head.appendChild(stylesheet);
	
				return stylesheet.sheet;
			}
		}]);