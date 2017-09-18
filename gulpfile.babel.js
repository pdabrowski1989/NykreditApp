const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const htmlreplace = require('gulp-html-replace');
const ngAnnotate = require('gulp-ng-annotate');

gulp.task('saas', () => {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/bootstrap/dist/css/bootstrap-theme.css',
        './app/**/*.scss',
    ])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('js-app', () => {
    return gulp.src([
        './app/**/*.js',
        '!./app/**/*.spec.js'
    ])
        .pipe(babel({presets: ["es2015"]}))
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('js-vendor', () => {
    return gulp.src([
        './node_modules/angular/angular.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js',
        './node_modules/bootstrap/dist/js/bootstrap.js'
    ])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('parse-index', () => {
    return gulp.src('./index.html')
        .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'app': 'js/app.min.js',
            'vendor': 'js/vendor.min.js'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-html', ['parse-index'], () => {
    return gulp.src([
        './**/*.html',
        '!./index.html',
        '!./node_modules/**',
        '!./dist/**'
    ])
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['js-app', 'js-vendor', 'copy-html', 'saas']);

gulp.task('watch', () => {
    return gulp.watch(['./index.html', './app/**/*.html', './app/**/*.scss', './app/**/*.js'], ['build']);
});

gulp.task('serve', ['watch', 'build'], () => {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "http://localhost:8000/dist/index.html"
        }));
});
