angular.module('Dashydash')
	.service('Dashydash.services.stylesheet', function(){
		
		var stylesheet, 
			maxRow=0, 
			maxHeight=0, 
			prototype = {},
			heightAttribute = ['dd-height', 'data-dd-height'],
			rowAttribute = ['dd-row', 'data-dd-row'],
			element = ['dd-item', '[dd-item]', '[data-dd-item]'],
			parentElement = ['dd-grid', '[dd-grid]'],
			gridIdAttribute = ['grid-id','data-grid-id'];

		prototype.generate = generateStylesheetfn;
		prototype.generateStyleHeight = generateStyleHeightfn;
		prototype.generateStyleRow = generateStyleRowfn;



		prototype.generate();

		return prototype;

		function generateStylesheetfn() {
			stylesheet = document.createElement('style');

			// WebKit hack [thanks to gridstack]
			stylesheet.appendChild(document.createTextNode(''));

			document.head.appendChild(stylesheet);

			return stylesheet.sheet;
		}

		function getPrefixes(gridId) {
			var prefixes = [];
			for(var i = 0; i<parentElement.length; i++) {
				let prefix = parentElement[i];
				if(gridId !== null && gridId !== undefined)
					for(var j = 0; gridIdAttribute.length; j++)
						prefix += '[' + gridIdAttribute[j] + '=' +gridId+ ']';

				prefixes.push(prefix);
			}
			return prefixes;
		}

		function insertRules(gridId, rules) {
			var prefixes = getPrefixes(gridId);

			for(var i =0; i<rules.length; i++)
				stylesheet.sheet.insertRule(prefixes + ' ' + rules[i]);
		}

		function generateStyleHeightfn(gridId, height, itemHeight) {

			var rules = [];
			for(let h = maxHeight; h<height; h++) {
				let css = '';
				for(let i = 0; i<element.length; i++) {
					let targets = [];
					for(let j =0; j<heightAttribute.length; j++)
						targets.push(element[i] + '[' + heightAttribute[j] + '=' + h + ']');
					css = targets.join(',') + '{height:'+(itemHeight * h)+'px;}';
				}
				rules.push(css);
			}

			insertRules(gridId, rules);
		}

		function generateStyleRowfn(gridId, row, itemHeight) {

			var rules = [];
			for(let y = maxRow; y<row; y++) {
				let css = '';
				for(let i = 0; i<element.length; i++) {
					let targets = [];
					for(let j =0; j<rowAttribute.length; j++)
						targets.push(element[i] + '[' + rowAttribute[j] + '=' + y + ']');
					css = targets.join(',') + '{height:'+(itemHeight * y)+'px;}';
				}
				rules.push(css);
			}

			insertRules(gridId, rules);
		}

	});