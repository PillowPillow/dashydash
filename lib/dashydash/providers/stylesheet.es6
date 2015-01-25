angular.module('Dashydash')
	.provider('Dashydash.providers.stylesheet', function() {

		this.$get = ['Dashydash.factories.stylesheet',
		'Dashydash.services.rule',
		(stylesheet, rule) => {

			class Stylesheet {

				constructor(parents = []) {
					this.sheet = stylesheet();
					this.parents = [];
					this.selector = '';
					this._initParents(parents);
				}

				get length() {
					return this.sheet.rules.length;
				}

				_initParents(parents = []) {
					if(typeof parents === 'string')
						parents = [{element:parents}];
					if(!(parents instanceof Array))
						parents = [parents];
					this.parents = parents;
				}

				getCSSSelector(element = {}) {
					var elements = this.parents.concat([element]);
					return rule.generateCSSSelector(elements);
				}

				_generateRule(element, property, value) {
					return this.getCSSSelector(element) + rule.generateCSSBody({[property]:value});
				}

				clearRules() {
					if(this.length > 0)
						this.sheet.removeRule(0);
				}

				removeRule(index = 0) {
					this.removeRule(index, 1);
				}

				addRule(element, property, value) {
					this.sheet.insertRule(this._generateRule(element, property, value), this.length);
				}

			}

			return Stylesheet;
		}];
	});