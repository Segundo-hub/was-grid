const rename = require('gulp-rename')
const prefixer = require('autoprefixer')
const postCss = require('gulp-postcss')

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

// Static Server + watching scss/html files
gulp.task(
    'serve',
    gulp.series('sass:compile', () => {
        browserSync.init({
            server: './app/',
        })
        gulp.watch('src/scss/**/*.scss', gulp.series('sass:compile'))
        gulp.watch('app/*.html').on('change', browserSync.reload)
    })
)

gulp.task('default', gulp.series('serve'))
