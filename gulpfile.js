var gulp 	    = require('gulp'),
	prefixer  	= require('gulp-autoprefixer'),
	sass 	    	= require('gulp-sass'),
	rigger      = require('gulp-rigger'),
	watch       = require('gulp-watch'),
	rimraf      = require('rimraf'),
	browserSync = require('browser-sync'),
	plumber 		= require('gulp-plumber'),
	merge       = require('merge-stream'),
	gm          = require('gulp-gm'),
	rename      = require('gulp-rename'),
  cheerio     = require('gulp-cheerio'),
  svgmin      = require('gulp-svgmin'),
  svgSprite   = require('gulp-svg-sprite'),
  replace     = require('gulp-replace'),
	pug         = require('gulp-pug'),
  beautify    = require('gulp-html-beautify'),
	reload 			= browserSync.reload;

var projectName = 'visavia';
var path = {
	build: {
		html: projectName + '/',
		js: projectName + '/js/',
		css: projectName + '/css/',
		img: projectName + '/img/',
		sprites: projectName + '/img/svg/',
		fonts: projectName + '/fonts/'
	},
	src: {
    pug: 'src/*.pug',
		js: 'src/js/*.js',
		sass: 'src/style/*.scss',
		css: 'src/style/*.css',
		img: 'src/img/**/*.*',
		sprites: 'src/img/svg/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		pug: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.*',
		img: 'src/img/**/*.*',
		sprites: 'src/img/svg/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clear: './build'
};
var config = {
	server: {
		baseDir: "./" + projectName
	},
	host: 'localhost',
	port: 9000,
	browser: 'chrome',
	logPrefix: "Frontend_BerTepesh"
};

gulp.task('pug:build', ()=>  {
  let options = {
    "indent_size": 2,
    "indent_with_tabs": true,
    "preserve_newlines": true,
    "space_after_anon_function": true,
    "brace_style": "collapse",
    "keep_array_indentation": true,
    "keep_function_indentation": true,
    "space_before_conditional": true,
    "break_chained_methods": true,
    "eval_code": true,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": true
  };
  return gulp.src(path.src.pug)
    .pipe(pug({pretty: true}))
    .pipe(beautify(options))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
gulp.task('js:build', ()=> {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});
gulp.task('fonts:build', () => {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});
gulp.task('css:build', ()=> {
	return gulp.src(path.src.css)
		.pipe(plumber())
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});
gulp.task('sass:build', ()=> {
	return gulp.src(path.src.sass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});
gulp.task('sprites:build', () => {
	return gulp.src(path.src.sprites)
		.pipe(plumber())
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg"
				}
			}
		}))
		.pipe(gulp.dest(path.build.sprites));
});
gulp.task('image:build', ()=> {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});
gulp.task('build', gulp.series(
	'pug:build',
	'js:build',
	'css:build',
	'sass:build',
  'sprites:build',
	'fonts:build',
	'image:build'
));
gulp.task('watch', () => {
	watch(path.watch.pug, gulp.parallel('pug:build'));
  watch(path.watch.sprites, gulp.parallel('sprites:build'));
	watch(path.watch.style, gulp.parallel('css:build', 'sass:build'));
	watch(path.watch.js, gulp.parallel('js:build'));
	watch(path.watch.img, gulp.parallel('image:build'));
	watch(path.watch.fonts, gulp.parallel('fonts:build'));
});
gulp.task('webserver', () => {return browserSync(config)});
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});
gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));