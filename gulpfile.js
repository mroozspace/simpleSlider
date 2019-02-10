const { src, dest, watch, series } = require('gulp');
const concat = require('gulp-concat');
const sass = require("gulp-sass");
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");
const HTMLmin = require("gulp-minify-html");
const autoprefixer = require("gulp-autoprefixer");
const del = require('del');
const server = require("browser-sync").create();

function html() {
  return src('src/*.html')
    .pipe(HTMLmin())
    .pipe(dest('build'))
}

function css() {
  return src('src/styles/**/*.scss')
    .pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
    .pipe(sass({outputStyle: 'compressed'}))
		.pipe(dest("build/styles"))
		.pipe(server.stream());
};

function js() {
  return src('src/*.js', { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('build/js', { sourcemaps: true }))
}

function assets() {
  return src('src/assets/*.*')
    .pipe(dest('build/assets'))
}

function clean() {
  return del(['build'])
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      injectChanges: true,
      baseDir: 'build'
    }
  });
  watch(
    ['src/*.html', 'src/styles/*.scss', 'src/styles/**/*.scss', 'src/*.js'], 
    series(clean, html, css, js, assets, reload)
  );
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.assets = assets;
exports.clean = clean;
exports.build = series(clean, js, css, assets, html)
exports.serve = series(clean, js, css, assets, html, serve);
