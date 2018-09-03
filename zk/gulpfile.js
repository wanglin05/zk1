var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var path = require('path');

var url = require('url');

var fs = require('fs');

var listData = require('./mock/list.json');

// 起服务

function serverFun(serverPath) {
    return gulp.src(serverPath)
        .pipe(server({
            port: 8080,
            middleware: function(res, req, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }

                if (pathname === '/api/list') {
                    res.end(JSON.stringify({ code: 1, data: listData }))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, serverPath, pathname)));
                }
            }
        }))
}

gulp.task('server', function() {
    return serverFun('src')
})


//配置scss
function cssTask(cssPath) {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())
        .pipe(gulp.dest(cssPath))
}

gulp.task('devCss', function() {
    return cssTask('./src/css')
})

// watch
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series(cssTask))
})

gulp.task('dev', gulp.series(gulp.parallel('devCss', 'server', 'watch')))

// 压缩

function uglifyTask() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
}
gulp.task(uglifyTask)

gulp.task('buildCss', function() {
    return cssTask('./build/css')
})

gulp.task('copyJs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('build/js/libs'))
})

gulp.task('build', gulp.series(uglifyTask, gulp.parallel('buildCss', 'copyJs')))