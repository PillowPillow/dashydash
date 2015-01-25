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

		function generateCSSSelectorfn(items, attrprefix = true) {
			var selectors = [];

			if(items instanceof Array) {
				for(let i = 0; i<items.length; i++)
					if(!(items[i] instanceof Object))
						items[i] = {element: items[i]};
			}
			else
				if(typeof items === 'string')
					items = [{element: items}];
			for(var i = 0; i<items.length; i++) {
				let selector = items[i].element,
					attributes = generateCSSSelectorAttributes(items[i].attributes, attrprefix),
					versions = [];


				if(attributes.length > 0) {
					for(let j = 0; j<attributes.length; j++) {
						let attrVersions = attributes[j];	
						for(let k = 0; k<attrVersions.length; k++)
							versions.push(`${selector}${attrVersions[k]}`);
					}
				}
				else
					versions.push(selector);

				selectors.push(versions);
			}
			return `${buildSelectorAsString(selectors).join(',')}`;
		}

		function buildSelectorAsString(selectors = []) {
			var output = [];
			selectors.reverse();
			build(selectors);
			return output;

			function build(array, strbuild = '') {
				var snapshot = array.slice(0),
					selectorVersions = snapshot.pop();

				if(!!selectorVersions) 
					for(var i = 0; i<selectorVersions.length; i++)
						build(snapshot, `${strbuild}${selectorVersions[i]} `);
				else
					output.push(strbuild);
			}
		}

		function generateCSSBodyRule(property, value) {
			return `${property}:${value};`;
		}

		function generateCSSSelectorAttributes(attributes = [], prefix = false) {
			attributes = formatAttributes(attributes);
			var selectorAttrs = [], attrnames = Object.keys(attributes);
			for(var i = 0; i< attrnames.length; i++) {
				let attrname = attrnames[i],
					attrval = generateCSSSelectorAttributeValue(attributes[attrname]),
					versions = [`[${attrname}${attrval}]`];
				if(prefix) versions.push(`[data-${attrname}${attrval}]`);
				selectorAttrs.push(versions);
			}
			return selectorAttrs;
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