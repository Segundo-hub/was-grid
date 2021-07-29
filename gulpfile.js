const rename = require('gulp-rename')
const prefixer = require('autoprefixer')
const postCss = require('gulp-postcss')
const GulpPug = require('gulp-pug-3')

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')

sass.compiler = require('sass')
// Compile sass into CSS & auto-inject into browsers

gulp.task('postcss:autoprefix', () =>
	gulp
		.src('./app/css/*')
		.pipe(postCss([prefixer()]))
		.pipe(gulp.dest('./app/css'))
)

gulp.task('sass:compile', () =>
	gulp
		.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(postCss([prefixer()]))
		.pipe(rename('bundle.lib.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
)

gulp.task('pug:compile', () => gulp.src('./app/index.pug').pipe(GulpPug({})).pipe(gulp.dest('./app/')))

// Static Server + watching scss/html files
gulp.task(
	'serve',
	gulp.series('sass:compile', () => {
		browserSync.init({
			server: './app/',
		})
		gulp.watch('src/scss/**/*.scss', gulp.series('sass:compile'))
		gulp.watch('./app/*.pug', gulp.series('pug:compile'))
		gulp.watch('app/*.pug').on('change', browserSync.reload)
	})
)

gulp.task('default', gulp.series('pug:compile', 'serve'))
