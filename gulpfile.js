var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('demoDeps', function() {
  return gulp.src('node_modules/d3/d3.js')
    .pipe(gulp.dest('demo'));
});

gulp.task('serve', ['build', 'demoDeps'], function() {
  browserSync({
    server: {
      baseDir: 'demo'
    }
  });
  gulp.watch(['*.html', '*.css', '*.js'], {cwd: 'demo'}, reload);
});

gulp.task('build', function() {

  return browserify('./src/lollipopChart.js', {standalone: 'LollipopChart', debug: true})
    .bundle()
    .pipe(source('lollipopChart.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('demo'));
});

gulp.task('dev', ['serve'], function() {
  gulp.watch('src/**/*.js', ['build']);
});