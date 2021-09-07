const rename = require('gulp-rename')
const autoprefixer = require('autoprefixer')
const postCss = require('gulp-postcss')
const GulpPug = require('gulp-pug-3')

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const CustomProperties = require('postcss-custom-properties')
const sass = require('gulp-sass')

sass.compiler = require('sass')

const postcssPlugins = [autoprefixer({})]

// =================================================================================
// ---------------------------  COMPILE BUILD SASS FILES ---------------------------
// =================================================================================

gulp.task('sass:compile', () =>
	gulp
		.src('src/layout/*.scss')
		.pipe(sass())
		.pipe(postCss(postcssPlugins))
		.pipe(rename('bundle.lib.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
)

// =================================================================================
// ---------------------------  COMPILE TESTING FILES ------------------------------
// =================================================================================

gulp.task('sass:testing', () => gulp.src('testing/*.scss').pipe(sass()).pipe(gulp.dest('testing/')))

// =================================================================================
// ---------------------------  COMPILE PUG FILES   --------------------------------
// =================================================================================

gulp.task('pug:compile', () => gulp.src('./app/index.pug').pipe(GulpPug({})).pipe(gulp.dest('./app/')))

// =================================================================================
// ---------------------------  SERVE ASSETS WITH CSS FILES -------------------------
// =================================================================================
gulp.task(
	'serve',
	gulp.series('sass:compile', () => {
		browserSync.init({
			server: './app/',
		})
		gulp.watch('src/**/**/*.scss', gulp.series('sass:compile'))
		gulp.watch('./app/*.pug', gulp.series('pug:compile'))
		gulp.watch('app/*.pug').on('change', browserSync.reload)
		gulp.watch('testing/**.scss', gulp.series('sass:testing'))
	})
)

gulp.task('default', gulp.series('pug:compile', 'serve'))
