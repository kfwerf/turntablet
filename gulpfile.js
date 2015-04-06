var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

function compile(watch) {
  var bundler = watchify(browserify('./app/js/es6/app.js', { debug: true }).transform(babel));

  function rebundle() {
    var bundle = bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/js/'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  } else {
    setTimeout(function () {
      bundler.close();
    }, 900);
  }

  rebundle();
}

function watch() {
  //return compile(true);
  setInterval(function () {
    compile();
    console.log('-> building...');
  }, 2000);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);
