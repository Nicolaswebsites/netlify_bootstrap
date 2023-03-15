import gulp from 'gulp';

// Needed for development (gulp)
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import sass from 'gulp-dart-sass';
import prefix from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import gcmqp from 'gulp-css-mqpacker';

// Copy Bootstrap JS-files
gulp.task('copy-js', () => {
    return gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
        .pipe(newer('./dist/js'))
        .pipe(notify({message: 'Copy JS files'}))
        .pipe(gulp.dest('./dist/js'));
});

// Compile sass into CSS (/dist/css/)
gulp.task('sass', () => {
    return gulp.src('./scss/**/*.scss')
        .pipe(
            plumber({
                errorHandler: notify.onError({
                    title: 'SASS compile error!',
                    message: '<%= error.message %>',
                }),
            })
        )
        .pipe(sourcemaps.init())
        // outputStyle: expanded or compressed
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefix('last 2 versions'))
        .pipe(gcmqp())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

// Live-reload the browser
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            directory: true,
        },
        startPath: '/index.html',
        port: 6600,
        ui: {
            port: 6602
        }
    });
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
    gulp.watch('./dist/**/*.{html,css,js}').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('copy-js', 'sass', 'browser-sync'));
