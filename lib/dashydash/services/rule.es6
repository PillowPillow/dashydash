angular.module('Dashydash')
	.service('Dashydash.services.rule', function() {

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
					attrval = generateCSSSelectorAttributeValue(attributes[attrname]);
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
	});