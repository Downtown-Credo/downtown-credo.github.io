var child = require('child_process');
var gulp = require('gulp');
var concat = require('gulp-concat');
var filelog = require('gulp-filelog');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var uncss = require('uncss').postcssPlugin;
var cssnano = require('cssnano');

gulp.task('sass', function() {
  // Compile SASS.
  return gulp.src('./_css/credo.scss')
    .pipe(sass({
      includePaths: [
        './_css',
        './node_modules/foundation-sites/scss',
      ],
      //outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(postcss([uncss({
        csspath: '_site/css/credo.css',
        html: [
          '_site/index.html',
          '_site/appointments.html',
          '_site/barbers.html',
        ],
      }), cssnano()]))
    .pipe(gulp.dest('./css'))
    .pipe(filelog());
});

gulp.task('sass:watch', function() {
  gulp.watch('./_css/**/*.scss', ['sass']);
});

gulp.task('js', function() {
  // Compile JS.
  return gulp.src([
    './node_modules/foundation-sites/dist/js/foundation.js',
    './_js/credo.js',
  ])
    .pipe(concat('credo.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(filelog());
});

gulp.task('js:watch', function() {
  gulp.watch('./_js/**/*.js', ['js']);
});

gulp.task('html-minify', function() {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('_site'));
});

gulp.task('jekyll', function(gulpCallback) {
  const jekyll = child.spawn('jekyll', ['build']);

  const jekyllLogger = function(buffer) {
    buffer.toString()
      .split(/\n/)
      .forEach(function(message) {
        gutil.log('Jekyll: ' + message);
      });
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);

  jekyll.on('exit', gulpCallback);
});

gulp.task('jekyll:serve', function() {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'serve']);

  const jekyllLogger = function(buffer) {
    buffer.toString()
      .split(/\n/)
      .forEach(function(message) {
        gutil.log('Jekyll: ' + message);
      });
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('default', gulp.series('sass', 'js', 'jekyll:serve', 'sass:watch', 'js:watch', function(done) {
  done();
}));

gulp.task('build', gulp.series('sass', 'js', 'jekyll', 'html-minify', function(done) {
  done();
}));
