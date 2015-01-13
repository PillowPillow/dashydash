angular.module('app')
	.controller('app.controllers.app', [
	'$mdSidenav', 
	'$timeout' ,
	function($mdSidenav, $timeout) {

		this.color = [
			'dark-primary-color',
			'default-primary-color',
			'light-primary-color',
			'accent-color'
		];

		var pickColor = () => this.color[~~(Math.random() * this.color.length)];
		
		this.items = [
			{y:1, x:4, w:2, h:3, border: pickColor()}/*,
			{y:9, x:4, w:3, h:3, border: pickColor()},
			{y:0, x:2, w:2, h:5, border: pickColor()},
			{y:0, x:5, w:1, h:4, border: pickColor()},
			{y:0, x:4, w:1, h:3, border: pickColor()},
			{y:3, x:6, w:2, h:3, border: pickColor()},
			{y:5, x:2, w:3, h:4, border: pickColor()},
			{y:0, x:6, w:2, h:3, border: pickColor()},
			{y:6, x:5, w:3, h:3, border: pickColor()}*/
		];

		this.addItem = () => this.items.push({y:~~(Math.random()*10 ), x:~~(Math.random()*10), w:~~(Math.random()*4 + 1), h:~~(Math.random()*4 + 1), border: pickColor()});

		this.togglePanel = () => $mdSidenav('left').toggle();
	}]);





