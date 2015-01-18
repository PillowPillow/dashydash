angular.module('app')
	.controller('app.controllers.viewTab', [
	'$mdSidenav', 
	function($mdSidenav) {
		this.color = [
			'dark-primary-color',
			'default-primary-color',
			'light-primary-color',
			'accent-color'
		];

		var pickColor = () => this.color[~~(Math.random() * this.color.length)];
		
		this.items = [
			{y:1, x:4, w:2, h:3, class: pickColor()}
		];

		this.addItem = (config = getRandomItemConfig()) => this.items.push(config);

		this.togglePanel = () => $mdSidenav('left').toggle();

		function getRandomItemConfig() {
			return {y:~~(Math.random()*10 ), x:~~(Math.random()*10), w:~~(Math.random()*4 + 1), h:~~(Math.random()*4 + 1), class: pickColor()};
		}
	}]);





