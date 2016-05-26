var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tap = require('gulp-tap');
var streamify = require('gulp-streamify');
var domain = require('domain');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

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

  gulp.src('./src/lollipopChart.js', {read: false})
    .pipe(tap(function(file) {
      // let gulp keep watching instead of dieing when there are syntax errors
      // adapted this error handling from: http://latviancoder.com/story/error-handling-browserify-gulp
      var d = domain.create();

      d.on("error", function(err) {
        gutil.log(
          gutil.colors.red("Browserify compile error: "),
          err.message,
          "\n\t",
          gutil.colors.cyan("in file"),
          file.path
        );
      });

      d.run(function() {
        file.contents = browserify({
          entries: [file.path],
          standalone: 'LollipopChart',
          debug: true
        })
        .bundle();
      });

    }))
    .pipe(streamify(concat('lollipopChart.js')))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('demo'));

});

gulp.task('dev', ['serve'], function() {
  gulp.watch('src/**/*.js', ['build']);
});