const { src, dest, watch, series } = require('gulp');
const concat = require('gulp-concat');
const sass = require("gulp-sass");
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");
const HTMLmin = require("gulp-minify-html");
const autoprefixer = require("gulp-autoprefixer");
const server = require("browser-sync").create();

function html() {
  return src('src/*.html')
    .pipe(HTMLmin())
    .pipe(dest('build'))
}

function css() {
  return src('src/*.scss')
    .pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
    .pipe(sass({outputStyle: 'compressed'}))
		.pipe(dest("build"))
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
  watch(['src/*.html', 'src/*.scss', 'src/*.js'], series(html, css, js, assets, reload));
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.assets = assets;
exports.serve = serve;
