let gulp           = require('gulp'),
	watch          = require('gulp-watch'),
	less           = require('gulp-less'),
	LessAutoprefix = require('less-plugin-autoprefix'),
	autoprefix     = new LessAutoprefix({ browsers: ['last 2 versions'] }),
	uglify         = require('gulp-uglify'),
	babel          = require('gulp-babel'),
	rigger         = require('gulp-rigger'),
	sourcemaps     = require('gulp-sourcemaps'),
	imagemin       = require('gulp-imagemin'),
	pngquant       = require('imagemin-pngquant'),
	cleanCSS       = require('gulp-clean-css'),
	rimraf         = require('rimraf'),
	browserSync    = require("browser-sync"),
	reload         = browserSync.reload,

	path = {
		build: {
			html: './build/',
			js: './build/js/',
			css: './build/css/',
			img: './build/img/',
			fonts: './build/fonts/'
		},
		src: {
			html: './src/*.html',
			js: './src/js/main.js',
			style: './src/less/main.less',
			img: './src/img/**/*.*',
			fonts: './src/fonts/**/*.*'
		},
		watch: {
			html: './src/**/*.html',
			js: './src/js/**/*.js',
			style: './src/less/**/*.less',
			img: './src/img/**/*.*',
			fonts: './src/fonts/**/*.*'
		},
		clean: './build'
	},

	config = {
		server: {
			baseDir: "./build"
		},
		tunnel: false,
		host: 'localhost',
		port: 9000,
		logPrefix: "ArkStudios"
	};

gulp.task('webserver', () => {
	browserSync(config);
});

gulp.task('clean', (cb) => {
	rimraf(path.clean, cb);
});

gulp.task('html:build', () => {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', () => {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(babel({
				presets: ['env']
			}))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', () => {
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(less({
				//plugins: [autoprefix]
			}))
		.pipe(cleanCSS({debug: true}, (details) => {
				console.log(`${details.name}: ${details.stats.originalSize}`);
				console.log(`${details.name}: ${details.stats.minifiedSize}`);
			}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:build', () => {
	gulp.src(path.src.img)
		.pipe(imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
				svgoPlugins: [{removeViewBox: true}]
			}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', () => {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
]);


gulp.task('watch', () => {
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});


gulp.task('default', ['build', 'webserver', 'watch']);