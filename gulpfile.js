'use strict';



// Packages
//------------------------------------------------------------------------------

const gulp = require('gulp'),
	concat = require('gulp-concat'),
	htmlmin = require('gulp-html-minifier'),
	csso = require('gulp-csso'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	wrap = require("gulp-wrap"),
	del = require('del'),
	csscomb = require('gulp-csscomb'),
	rigger = require('gulp-rigger'),
	notify = require('gulp-notify'),
	multipipe = require('multipipe'),
	browserSync = require('browser-sync').create(),
	gulpsync = require('gulp-sync')(gulp);



// Paths
//------------------------------------------------------------------------------

const paths = {
	docs: 'docs/',
	dist: {
		base: 'dist/',
		css: 'dist/css/',
		js: 'dist/js/'
	},
	src: {
		base: [
			'src/*.html'
		],
		css: {
			libs: [
				'node_modules/normalize.css/normalize.css'
			],
			main: [
				'src/less/main.less'
			]
		},
		js: {
			libs: [
				'node_modules/jquery/dist/jquery.min.js'
			],
			app: [
				'src/js/app.js'
			]
		}
	},
	watch: {
		base: 'src/**/*.html',
		css: 'src/**/*.less',
		js: 'src/**/*.js'
	}
};



// Build
//------------------------------------------------------------------------------

gulp.task('html', function() {
	return multipipe(
		gulp.src(paths.src.base),
		htmlmin({
			collapseInlineTagWhitespace: true,
			collapseWhitespace: true,
			removeComments: true
		}),
		gulp.dest(paths.dist.base),
		browserSync.stream()
	);
});

gulp.task('css:libs', function() {
	return multipipe(
		gulp.src(paths.src.css.libs),
		concat('libs.min.css'),
		csso({
			restructure: false
		}),
		gulp.dest(paths.dist.css)
	);
});

gulp.task('css:main', function() {
	return multipipe(
		gulp.src(paths.src.css.main),
		concat('main.min.css'),
		less(),
		autoprefixer(),
		csscomb(),
		csso(),
		gulp.dest(paths.dist.css),
		browserSync.stream()
	).on('error', notify.onError(function(err) {
		return {
			title: 'css:main',
			message: 'Line: ' + err.line
		}
	}));
});

gulp.task('js:libs', function() {
	return multipipe(
		gulp.src(paths.src.js.libs),
		concat('libs.min.js'),
		uglify({
			mangle: false
		}),
		gulp.dest(paths.dist.js)
	);
});

gulp.task('js:app', function() {
	return multipipe(
		gulp.src(paths.src.js.app),
		rigger(),
		concat('app.min.js'),
		wrap("(function($){'use strict';<%= contents %>})(jQuery);"),
		uglify(),
		gulp.dest(paths.dist.js),
		browserSync.stream()
	).on('error', notify.onError(function(err) {
		return {
			title: 'js:app',
			message: 'Line: ' + err.line
		}
	}));
});



// Build Docs
//------------------------------------------------------------------------------

gulp.task('docs', ['clean:docs', 'default'], function() {
	return multipipe(
		gulp.src(paths.dist.base + '**'),
		gulp.dest(paths.docs)
	);
});



// Watch
//------------------------------------------------------------------------------

gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: paths.dist.base
		},
		notify: false
	});

	gulp.watch(paths.watch.base, ['html']);
	gulp.watch(paths.watch.css, ['css:main']);
	gulp.watch(paths.watch.js, ['js:app']);
});



// Clean
//------------------------------------------------------------------------------

gulp.task('clean:dist', function() {
	return del.sync(['dist/**', '!dist']);
});

gulp.task('clean:docs', function() {
	return del.sync(['docs/**', '!docs']);
});



// Default
//------------------------------------------------------------------------------

gulp.task('default', gulpsync.sync(['clean:dist', 'html', 'css:libs', 'css:main', 'js:libs', 'js:app']));
