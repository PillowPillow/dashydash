angular.module('app')
	.controller('app.controllers.app', [
	'$mdSidenav', 
	function($mdSidenav) {
		console.log('hello')
		this.color = [
			'dark-primary-color',
			'default-primary-color',
			'light-primary-color',
			'accent-color'
		];

		var pickColor = () => this.color[~~(Math.random() * this.color.length)];
		
		this.items = [
			{y:1, x:4, w:2, h:3, class: pickColor()}/*,
			{y:9, x:4, w:3, h:3, class: pickColor()},
			{y:0, x:2, w:2, h:5, class: pickColor()},
			{y:0, x:5, w:1, h:4, class: pickColor()},
			{y:0, x:4, w:1, h:3, class: pickColor()},
			{y:3, x:6, w:2, h:3, class: pickColor()},
			{y:5, x:2, w:3, h:4, class: pickColor()},
			{y:0, x:6, w:2, h:3, class: pickColor()},
			{y:6, x:5, w:3, h:3, class: pickColor()}*/
		];

		this.addItem = (config = getRandomItemConfig()) => this.items.push(config);

		this.togglePanel = () => $mdSidenav('left').toggle();

		function getRandomItemConfig() {
			return {y:~~(Math.random()*10 ), x:~~(Math.random()*10), w:~~(Math.random()*4 + 1), h:~~(Math.random()*4 + 1), class: pickColor()};
		}
	}]);





