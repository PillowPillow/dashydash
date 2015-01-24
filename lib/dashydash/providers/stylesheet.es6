angular.module('Dashydash')
	.provider('Dashydash.providers.stylesheet', function() {

		this.$get = ['Dashydash.factories.stylesheet',
		'Dashydash.services.rule',
		(stylesheet, rule) => {

			class Stylesheet {

				constructor(element, parents = []) {
					this.sheet = stylesheet();
					this.parents = [];
					this.selector = '';
					this._initParents(parents);
					this._initCSSSelector(element);
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

				_initCSSSelector(element = {}) {
					var strSelector = '';
					for(var i = 0; i<this.parents.length; i++) {
						let parent = this.parents[i];
						strSelector += rule.generateCSSSelector(parent.element, parent.attributes);
					}

					this.selector = strSelector + rule.generateCSSSelector(element.element, element.attributes);
				}

				clearRules() {
					if(this.length > 0)
						this.sheet.removeRule(0);
				}

				removeRule(index = 0) {
					this.removeRule(index, 1);
				}

				addRule(property, value) {
					console.log(this.selector + rule.generateCSSBody(property, value));
				}

			}

			return Stylesheet;
		}];
	});