var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');

gulp.task('socket.io', function() {
  return gulp.src('./node_modules/socket.io-client/socket.io.js')
    .pipe(gulp.dest('./public/vendors'));
});

gulp.task('inject', function () {
  return gulp.src('./public/index.html')
    .pipe(inject(gulp.src(['./public/app/**/*.js'], {read: false}), {relative: true}))
    .pipe(wiredep())
    .pipe(gulp.dest('./public'));
});

gulp.task('default', ['socket.io', 'inject']);
