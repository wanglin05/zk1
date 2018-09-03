var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var path = require('path');

var url = require('url');

var fs = require('fs');

var babel = require('gulp-babel');

var searchJson = require('./mock/search.json');

//起服务

function serverFun(serverPath) {
    return gulp.src(serverPath)
        .pipe(server({
            port: 8080,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }

                if (pathname === '/api/search') {
                    var key = url.parse(req.url, true).query.key;
                    var target = [];
                    searchJson.forEach(function(item) {
                        if (item.title.match(key)) {
                            target.push(item)
                        }
                    })
                    res.end(JSON.stringify({ code: 1, data: target }))
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

// 压缩

function uglifyTask() {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
}
gulp.task('dev', gulp.series(uglifyTask, gulp.parallel('devCss', 'server', 'watch')))

gulp.task(uglifyTask)