(function(scope, _) {

	var Utils = {
		is_intercepted: function(a, b) {
			return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
		},

		sort: function(nodes, dir, width) {
			width = width || _.chain(nodes).map((node) => node.x + node.width).max().value();
			dir = dir !== -1 ? 1 : -1;
			return _.sortBy(nodes, (n) => dir * (n.x + n.y * width));
		},

		create_stylesheet: function() {
			var style = document.createElement('style');

			// style.setAttribute("media", "screen")
			// style.setAttribute("media", "only screen and (max-width : 1024px)")

			// WebKit hack :(
			style.appendChild(document.createTextNode(''));

			document.head.appendChild(style);

			return style.sheet;
		}
	};

	var idSeq = 0;

	var GridStackEngine = function(width, onchange, float, height, items) {
		this.width = width;
		this.float = float || false;
		this.height = height || 0;

		this.nodes = items || [];
		this.onchange = onchange || function() {
		};
	};

	GridStackEngine.prototype._fix_collisions = function(node) {
		this._sort_nodes(-1);

		var collisionNode;

		while(true) {
			collisionNode = _.find(this.nodes, (n) => n !== node && Utils.is_intercepted(n, node), this);
			if(typeof collisionNode === 'undefined')
				return;
			this.move_node(collisionNode, collisionNode.x, node.y + node.height, collisionNode.width, collisionNode.height, true);
		}
	};

	GridStackEngine.prototype._sort_nodes = function(dir) {
		this.nodes = Utils.sort(this.nodes, dir, this.width);
	};

	GridStackEngine.prototype._pack_nodes = function() {
		this._sort_nodes();

		if(this.float) {
			_.each(this.nodes, function(n) {
				if(n._updating || typeof n._orig_y === 'undefined' || n.y == n._orig_y)
					return;

				var newY = n.y;
				while(newY >= n._orig_y) {
					var collisionNode = _.chain(this.nodes)
						.find((bn) => n != bn && Utils.is_intercepted({x: n.x, y: newY, width: n.width, height: n.height}, bn))
						.value();

					if(!collisionNode) {
						n._dirty = true;
						n.y = newY;
					}
					--newY;
				}
			}, this);
		}
		else {
			_.each(this.nodes, function(n, i) {
				if(n.locked)
					return;
				while(n.y > 0) {
					var newY = n.y - 1;
					var canBeMoved = i === 0;

					if(i > 0) {
						var collisionNode = _.chain(this.nodes)
							.first(i)
							.find((bn) => Utils.is_intercepted({x: n.x, y: newY, width: n.width, height: n.height}, bn))
							.value();
						canBeMoved = typeof collisionNode === 'undefined';
					}

					if(!canBeMoved)
						break;

					n._dirty = n.y !== newY;
					n.y = newY;
				}
			}, this);
		}
	};

	GridStackEngine.prototype._prepare_node = function(node, resizing) {
		node = _.defaults(node || {}, {width: 1, height: 1, x: 0, y: 0});

		node.x = parseInt('' + node.x);
		node.y = parseInt('' + node.y);
		node.width = parseInt('' + node.width);
		node.height = parseInt('' + node.height);
		node.auto_position = node.auto_position || false;
		node.no_resize = node.no_resize || false;
		node.no_move = node.no_move || false;

		node.width = node.width > this.width ? this.width : (node.width < 1 ? 1 : node.width);
		node.height = node.height < 1 ? 1 : node.height;
		node.y = node.y < 0 ? 0 : node.y;
		node.x = node.x < 0 ? 0 : node.x;

		if(node.x + node.width > this.width)
			if(resizing)
				node.width = this.width - node.x;
			else
				node.x = this.width - node.width;

		return node;
	};

	GridStackEngine.prototype._notify = function() {
		var deletedNodes = Array.prototype.slice.call(arguments, 1).concat(this.get_dirty_nodes());
		deletedNodes = deletedNodes.concat(this.get_dirty_nodes());
		this.onchange(deletedNodes);
	};

	GridStackEngine.prototype.clean_nodes = function() {
		_.each(this.nodes, (n) => n._dirty = false);
	};

	GridStackEngine.prototype.get_dirty_nodes = function() {
		return _.filter(this.nodes, (n) => n._dirty);
	};

	GridStackEngine.prototype.add_node = function(node) {
		node = this._prepare_node(node);

		if(typeof node.max_width !== 'undefined')
			node.width = Math.min(node.width, node.max_width);
		if(typeof node.max_height !== 'undefined')
			node.height = Math.min(node.height, node.max_height);
		if(typeof node.min_width !== 'undefined')
			node.width = Math.max(node.width, node.min_width);
		if(typeof node.min_height !== 'undefined')
			node.height = Math.max(node.height, node.min_height);

		node._id = ++idSeq;
		node._dirty = true;

		if(node.auto_position) {
			this._sort_nodes();

			for(var i = 0; ; ++i) {
				var x = i % this.width,
				    y = Math.floor(i / this.width);

				if(x + node.width > this.width)
					continue;
				if(!_.find(this.nodes, (n) => Utils.is_intercepted({x: x, y: y, width: node.width, height: node.height}, n))) {
					node.x = x;
					node.y = y;
					break;
				}
			}
		}

		this.nodes.push(node);

		this._fix_collisions(node);
		this._pack_nodes();
		this._notify();
		return node;
	};

	GridStackEngine.prototype.remove_node = function(node) {
		node._id = null;
		this.nodes = _.without(this.nodes, node);
		this._pack_nodes();
		this._notify(node);
	};

	GridStackEngine.prototype.can_move_node = function(node, x, y, width, height) {
		var hasLocked = Boolean(_.find(this.nodes, (n) => n.locked));

		if(!this.height && !hasLocked)
			return true;

		var clonedNode = {};
		var clone = new GridStackEngine(
			this.width,
			null,
			this.float,
			0,
			_.map(this.nodes, (n) => {
				if(n === node) {
					clonedNode = $.extend({}, n);
					return clonedNode;
				}
				return $.extend({}, n);
			}));

		clone.move_node(clonedNode, x, y, width, height);

		var res = true;

		if(hasLocked)
			res &= !Boolean(_.find(clone.nodes, (n) => n !== clonedNode && Boolean(n.locked) && Boolean(n._dirty)));
		if(this.height)
			res &= clone.get_grid_height() <= this.height;

		return res;
	};

	GridStackEngine.prototype.can_be_placed_with_respect_to_height = function(node) {
		if(!this.height)
			return true;

		var clone = new GridStackEngine(
			this.width,
			null,
			this.float,
			0,
			_.map(this.nodes, (n) => $.extend({}, n)));
		clone.add_node(node);
		return clone.get_grid_height() <= this.height;
	};

	GridStackEngine.prototype.move_node = function(node, x, y, width, height, no_pack) {
		if(typeof x !== 'number') x = node.x;
		if(typeof y !== 'number') y = node.y;
		if(typeof width !== 'number') width = node.width;
		if(typeof height !== 'number') height = node.height;

		if(typeof node.max_width !== 'undefined') width = Math.min(width, node.max_width);
		if(typeof node.max_height !== 'undefined') height = Math.min(height, node.max_height);
		if(typeof node.min_width !== 'undefined') width = Math.max(width, node.min_width);
		if(typeof node.min_height !== 'undefined') height = Math.max(height, node.min_height);

		var resultNode;

		if(node.x === x && node.y === y && node.width === width && node.height === height)
			resultNode = node;
		else {
			var resizing = node.width !== width;
			node._dirty = true;

			node.x = x;
			node.y = y;
			node.width = width;
			node.height = height;

			node = this._prepare_node(node, resizing);

			this._fix_collisions(node);
			if(!no_pack) {
				this._pack_nodes();
				this._notify();
			}
			resultNode = node;
		}
		return resultNode;
	};

	GridStackEngine.prototype.get_grid_height = function() {
		return _.reduce(this.nodes, (memo, n) => Math.max(memo, n.y + n.height), 0);
	};

	GridStackEngine.prototype.begin_update = function(node) {
		_.each(this.nodes, (n) => n._orig_y = n.y);
		node._updating = true;
	};

	GridStackEngine.prototype.end_update = function() {
		var n = _.find(this.nodes, (n) => n._updating);
		if (n)
			n._updating = false;
	};

	var GridStack = function(el, opts) {
		var self = this, oneColumnMode;

		this.container = $(el);

		this.opts = _.defaults(opts || {}, {
			width: parseInt(this.container.attr('data-gs-width')) || 12,
			height: parseInt(this.container.attr('data-gs-height')) || 0,
			item_class: 'grid-stack-item',
			placeholder_class: 'grid-stack-placeholder',
			handle: '.grid-stack-item-content',
			cell_height: 60,
			vertical_margin: 20,
			auto: true,
			min_width: 768,
			float: false,
			_class: 'grid-stack-' + (Math.random() * 10000).toFixed(0),
			animate: Boolean(this.container.attr('data-gs-animate')) || false
		});

		this.container.addClass(this.opts._class);
		this._styles = Utils.create_stylesheet();
		this._styles._max = 0;

		this.grid = new GridStackEngine(this.opts.width, (nodes) => {
			var maxHeight = 0;
			_.each(nodes, (n) => {
				if(n._id === null)
					n.el.remove();
				else {
					n.el
						.attr('data-gs-x', n.x)
						.attr('data-gs-y', n.y)
						.attr('data-gs-width', n.width)
						.attr('data-gs-height', n.height);
					maxHeight = Math.max(maxHeight, n.y + n.height);
				}
			});
			maxHeight += 10;
			if(maxHeight > self._styles._max) {
				for(var i = self._styles._max; i < maxHeight; ++i) {
					var css;
					css = '.' + self.opts._class + ' .' + self.opts.item_class + '[data-gs-height="' + (i + 1) + '"] { height: ' + (self.opts.cell_height * (i + 1) + self.opts.vertical_margin * i) + 'px; }';
					self._styles.insertRule(css, i);
					css = '.' + self.opts._class + ' .' + self.opts.item_class + '[data-gs-y="' + (i) + '"] { top: ' + (self.opts.cell_height * i + self.opts.vertical_margin * i) + 'px; }';
					self._styles.insertRule(css, i);
				}
				self._styles._max = maxHeight;
			}
		}, this.opts.float, this.opts.height);

		if(this.opts.auto)
			this.container.find('.' + this.opts.item_class).each((index, el) => self._prepare_element(el));

		this.set_animation(this.opts.animate);

		this.placeholder = $('<div class="' + this.opts.placeholder_class + ' ' + this.opts.item_class + '"><div class="placeholder-content" /></div>').hide();
		this.container.append(this.placeholder);
		this.container.height((this.grid.get_grid_height()) * (this.opts.cell_height + this.opts.vertical_margin) - this.opts.vertical_margin);

		var onResizeHandler = () => {
			if(self._is_one_column_mode()) {
				if(oneColumnMode)
					return;

				oneColumnMode = true;

				_.each(self.grid.nodes, (node) => {
					if(!node.no_move)
						node.el.draggable('disable');
					if(!node.no_resize)
						node.el.resizable('disable');
				});
			}
			else {
				if(!oneColumnMode)
					return;

				oneColumnMode = false;

				_.each(self.grid.nodes, (node) => {
					if(!node.no_move)
						node.el.draggable('enable');
					if(!node.no_resize)
						node.el.resizable('enable');
				});
			}
		};

		$(window).resize(onResizeHandler);
		onResizeHandler();
	};

	GridStack.prototype._update_container_height = function() {
		this.container.height(this.grid.get_grid_height() * (this.opts.cell_height + this.opts.vertical_margin) - this.opts.vertical_margin);
	};

	GridStack.prototype._is_one_column_mode = function() {
		return $(window).width() <= this.opts.min_width;
	};

	GridStack.prototype._prepare_element = function(el) {
		var self = this;
		el = $(el);

		el.addClass(this.opts.item_class);

		var node = self.grid.add_node({
			x: el.attr('data-gs-x'),
			y: el.attr('data-gs-y'),
			width: el.attr('data-gs-width'),
			height: el.attr('data-gs-height'),
			max_width: el.attr('data-gs-max-width'),
			min_width: el.attr('data-gs-min-width'),
			max_height: el.attr('data-gs-max-height') || 100,
			min_height: el.attr('data-gs-min-height'),
			auto_position: el.attr('data-gs-auto-position'),
			no_resize: el.attr('data-gs-no-resize'),
			no_move: el.attr('data-gs-no-move'),
			locked: el.attr('data-gs-locked'),
			el: el
		});
		el.data('_gridstack_node', node);

		var cellWidth,
		    cellHeight = this.opts.cell_height + this.opts.vertical_margin;

		var onStartMoving = function() {
			var o = $(this);
			self.grid.clean_nodes();
			self.grid.begin_update(node);
			cellWidth = Math.ceil(o.outerWidth() / o.attr('data-gs-width'));
			self.placeholder
				.attr('data-gs-x', o.attr('data-gs-x'))
				.attr('data-gs-y', o.attr('data-gs-y'))
				.attr('data-gs-width', o.attr('data-gs-width'))
				.attr('data-gs-height', o.attr('data-gs-height'))
				.show();
			node.el = self.placeholder;
		};

		var onEndMoving = function() {
			var o = $(this);
			node.el = o;
			self.placeholder.hide();
			o
				.attr('data-gs-x', node.x)
				.attr('data-gs-y', node.y)
				.attr('data-gs-width', node.width)
				.attr('data-gs-height', node.height)
				.removeAttr('style');
			self._update_container_height();
			self.container.trigger('change', [self.grid.get_dirty_nodes()]);

			self.grid.end_update();

			self.grid._sort_nodes();
			setTimeout(() => { //if animating, delay detaching & reattaching all elements until animation finishes
				_.each(self.grid.nodes, (node) => {
					node.el.detach();
					self.container.append(node.el);
				});
			}, (self.opts.animate ? 300 : 0));
		};

		el.draggable({
			handle: this.opts.handle,
			scroll: true,
			appendTo: 'body',

			start: onStartMoving,
			stop: onEndMoving,
			drag: (event, ui) => {
				var x = Math.round(ui.position.left / cellWidth),
				    y = Math.floor((ui.position.top + cellHeight / 2) / cellHeight);

				if(!self.grid.can_move_node(node, x, y, node.width, node.height))
					return;

				self.grid.move_node(node, x, y);
				self._update_container_height();
			}
		}).resizable({
			autoHide: true,
			handles: 'se',
			minHeight: this.opts.cell_height - 10,
			minWidth: 70,

			start: onStartMoving,
			stop: onEndMoving,
			resize: (event, ui) => {
				var width = Math.round(ui.size.width / cellWidth),
				    height = Math.round(ui.size.height / cellHeight);

				if(!self.grid.can_move_node(node, node.x, node.y, width, height))
					return;

				self.grid.move_node(node, node.x, node.y, width, height);
				self._update_container_height();
			}
		});

		if(node.no_move || this._is_one_column_mode())
			el.draggable('disable');
		if(node.no_resize || this._is_one_column_mode())
			el.resizable('disable');

		el.attr('data-gs-locked', node.locked ? 'yes' : null);
	};

	GridStack.prototype.set_animation = function(enable) {
		if(enable)
			this.container.addClass('grid-stack-animate');
		else
			this.container.removeClass('grid-stack-animate');
	};

	GridStack.prototype.add_widget = function(el, x, y, width, height, auto_position) {
		el = $(el);
		if(typeof x !== 'undefined') el.attr('data-gs-x', x);
		if(typeof y !== 'undefined') el.attr('data-gs-y', y);
		if(typeof width !== 'undefined') el.attr('data-gs-width', width);
		if(typeof height !== 'undefined') el.attr('data-gs-height', height);
		if(typeof auto_position !== 'undefined') el.attr('data-gs-auto-position', auto_position);
		this.container.append(el);
		this._prepare_element(el);
		this._update_container_height();
	};

	GridStack.prototype.will_it_fit = function(x, y, width, height, auto_position) {
		var node = {x: x, y: y, width: width, height: height, auto_position: auto_position};
		return this.grid.can_be_placed_with_respect_to_height(node);
	};

	GridStack.prototype.remove_widget = function(el) {
		el = $(el);
		var node = el.data('_gridstack_node');
		this.grid.remove_node(node);
		el.remove();
		this._update_container_height();
	};

	GridStack.prototype.remove_all = function() {
		_.each(this.grid.nodes, (node) => node.el.remove());
		this.grid.nodes = [];
		this._update_container_height();
	};

	GridStack.prototype.resizable = function(el, val) {
		el = $(el);
		el.each((index, el) => {
			el = $(el);
			var node = el.data('_gridstack_node');
			if(typeof node === 'undefined')
				return;

			node.no_resize = !(val || false);
			if(node.no_resize)
				el.resizable('disable');
			else
				el.resizable('enable');
		});
		return this;
	};

	GridStack.prototype.movable = function(el, val) {
		el = $(el);
		el.each((index, el) => {
			el = $(el);
			var node = el.data('_gridstack_node');
			if(typeof node === 'undefined')
				return;

			node.no_move = !(val || false);
			if(node.no_move)
				el.draggable('disable');
			else
				el.draggable('enable');
		});
		return this;
	};

	GridStack.prototype.locked = function(el, val) {
		el = $(el);
		el.each((index, el) => {
			el = $(el);
			var node = el.data('_gridstack_node');
			if(typeof node === 'undefined')
				return;

			node.locked = (val || false);
			el.attr('data-gs-locked', node.locked ? 'yes' : null);
		});
		return this;
	};

	GridStack.prototype._update_element = function(el, callback) {
		el = $(el).first();
		var node = el.data('_gridstack_node');
		if(typeof node === 'undefined')
			return;

		var self = this;

		self.grid.clean_nodes();
		self.grid.begin_update(node);

		callback.call(this, el, node);

		self._update_container_height();
		self.container.trigger('change', [self.grid.get_dirty_nodes()]);

		self.grid.end_update();

		self.grid._sort_nodes();
		_.each(self.grid.nodes, (node) => {
			node.el.detach();
			self.container.append(node.el);
		});
	};

	GridStack.prototype.resize = function(el, width, height) {
		this._update_element(el, function(el, node) {
			width = (width !== null && typeof width !== 'undefined') ? width : node.width;
			height = (height !== null && typeof height !== 'undefined') ? height : node.height;

			this.grid.move_node(node, node.x, node.y, width, height);
		});
	};

	GridStack.prototype.move = function(el, x, y) {
		this._update_element(el, function(el, node) {
			x = (x !== null && typeof x !== 'undefined') ? x : node.x;
			y = (y !== null && typeof y !== 'undefined') ? y : node.y;

			this.grid.move_node(node, x, y, node.width, node.height);
		});
	};

	scope.GridStackUI = GridStack;

	scope.GridStackUI.Utils = Utils;

	$.fn.gridstack = function(opts) {
		return this.each(function () {
			if (!$(this).data('gridstack')) {
				$(this).data('gridstack', new GridStack(this, opts));
			}
		});
	};

})(window, _);


$(function() {
	$('.grid-stack').gridstack({
		cell_height: 80,
		vertical_margin: 10,
		float: true,
		animate: true
	});
});
