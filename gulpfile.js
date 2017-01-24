var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create()
var reload = browserSync.reload

gulp.task('test', function() {
    return console.log('This is a test!')
})

gulp.task('html', function() {

    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
})

gulp.task('css', function() {

    return gulp.src('src/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/static'))
})

gulp.task('sass', function() {

    return gulp.src('src/*.scss')
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/static'))
})

gulp.task('js', function() {

    return gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/static'))
})

gulp.task('build', ['sass', 'html', 'js'])

gulp.task('dev', ['js:dev', 'css:dev', 'sass:dev', 'html:dev'], function() {
    browserSync.init({
        server: {
            baseDir: "./dist" // 设置服务器的根目录为 dist 目录
        },
        notify: false // 开启静默模式
    })
    gulp.watch('src/*.js', ['js:dev'])
    gulp.watch('src/*.scss', ['sass:dev'])
    gulp.watch('src/*.css', ['css:dev'])
    gulp.watch('src/*.html', ['html:dev'])
})

gulp.task('html:dev', function() {

    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('css:dev', function() {

    return gulp.src('src/*.css')
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('sass:dev', function() {

    return gulp.src('src/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('js:dev', function() {

    return gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/static'))
        .pipe(reload({
            stream: true
        }))
})