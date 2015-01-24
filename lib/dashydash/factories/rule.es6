angular.module('Dashydash')
	.factory('Dashydash.factories.rule', function() {

		var prototype = {};

		prototype.generateCSSBody = generateCSSBodyfn;
		prototype.generateCSSSelector = generateCSSSelectorfn;

		return prototype;

		function generateCSSBodyfn(properties = {}) {
			var body = '', attrnames = Object.keys(properties);
			for(var i = 0; i<attrnames.length; i++) {
				let attrname = attrnames[i];
				body += generateCSSBodyRule(attrname, properties[attrname]);
			}
			return `\{${body}\}`;
		}

		function generateCSSSelectorfn(item, attrs = []) {
			return `${item}${generateCSSSelectorAttributes(attrs)} `;
		}

		function generateCSSBodyRule(property, value) {
			return `${property}:${value};`;
		}

		function generateCSSSelectorAttributes(attributes = []) {
			attributes = formatAttributes(attributes);
			var attrSelector = '', attrnames = Object.keys(attributes);
			for(var i = 0; i< attrnames.length; i++) {
				let attrname = attrnames[i],
					attrval = generateCSSSelectorAttributeValue();
				attrSelector += `[${attrname}${attrval}]`;
			}
			return attrSelector;
		}

		function generateCSSSelectorAttributeValue(attrvalue = undefined) {
			return attrvalue !== undefined ? `="${attrvalue}"` : '';
		}

		function formatAttributes(attributes = []) {
			if(attributes instanceof Array) {
				let attrs = {};
				for(let i = 0; i< attributes.length; i++) {
					let attrname = attributes[i];
					attrs[attrname] = undefined;
				}
				attributes = attrs;
			}
			return attributes;
		}






		// function r(gridname, height, h) {
		// 	return `dd-grid[data-grid-id="${gridname}"] dd-item[dd-height="${height}"], 
		// 		dd-grid[grid-id="${gridname}"] dd-item[data-dd-height="${height}"],
		// 		[dd-grid][data-grid-id="${gridname}"] dd-item[dd-height="${height}"],
		// 		[dd-grid][grid-id="${gridname}"] dd-item[data-dd-height="${height}"]{height:${true?height*h:'oui'}px;}`;
		// };
	});