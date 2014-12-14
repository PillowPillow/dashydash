var Path = require('path');

function Grunt(grunt) {

	var Configuration = {},
		tasks = [
			'grunt-6to5',
			'johto-require',
			'grunt-add-comment',
			'grunt-html2js'
		];

	for(var i = 0; i < tasks.length; i++)
		grunt.loadNpmTasks(tasks[i]);

	require('time-grunt')(grunt);

	var pathOption = getPathOption();

	function getPathOption() {
		var pathOption = false;

		if(grunt.option('path')) {

			pathOption = {};
			pathOption.name = Path.normalize(grunt.option('path')).replace(__dirname, '').slice(1);
			pathOption.extension = Path.extname(grunt.option('path'));
		}

		return pathOption;
	}

	Configuration.package = grunt.file.readJSON('package.json');

	Configuration.johto_require = {
		'6to5': {
			options: {
				match: 'Symbol|Promise|regeneratorRuntime',
				insert: 'require("6to5/polyfill");'
			},
			files: [{
				expand: true,
				cwd: __dirname,
				src: ( pathOption ? [ pathOption.name.replace('.es6', '.js') ] :  ['lib/**/*.js']),
				dest: __dirname
			}]
		}
	};

	Configuration['6to5'] = {
		options: {
			sourceMap: false
		},
		dist: {
			files: [{
				expand: true,
				cwd: __dirname,
				ext: '.js',
				src: ( pathOption ? pathOption.name : ['lib/**/*.es6'] ),
				dest: __dirname
			}]
		}
	};

	Configuration.add_comment = {
		common: {
			options: {
				comments: ['Autogenerated, do not edit. All changes will be undone.'],
				prepend: true,
				syntaxes: {
					'.js': '//'
				}
			},
			files: [{
				expand: true,
				cwd: '',
				src: ( pathOption ? [pathOption.name.replace('.es6', '.js')] : ['lib/**/*.js'] ),
				dest: ''
			}]
		}
	};

	Configuration.html2js = {
		options: {
			quoteChar: '\'',
			indentString: '\t',
			singleModule: true,
			target: 'js',
			module: 'Dashydash-templates',
			base: __dirname + '/templates'
		},
		app: {
			src: [__dirname + '/templates/**/*.jade'],
			dest: __dirname + '/lib/dashydash-templates/core.js'
		}
	};

	grunt.initConfig(Configuration);

	grunt.registerTask('es6', ['6to5:dist', 'johto_require:6to5', 'add_comment']);
}

module.exports = Grunt;