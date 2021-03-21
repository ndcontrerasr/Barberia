const { src, dest, watch , parallel, series } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
var jshint = require('gulp-jshint');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

// css es una función que se puede llamar automaticamente
function css() {
  console.log('Compilando SASS');
  return src(paths.scss)
    //------------------------------
    //Mensahe de error en el codigo
    .pipe(plumber({ // * 3 * //
      errorHandler: function(err) {
        notify.onError({ // * 4 * //
          title:    'Gulp Error',
          message:  '<%= error.message %>',
          sound:    'Bottle'
        })(err);
        this.emit('end'); // * 5 * //
      }
    }))
    //------------------------------
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}))
    // .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe( dest('./build/css') );
}

function javascript() {
    return src(paths.js)
      // .pipe(sourcemaps.init())
      .pipe(jshint())
      // .pipe(notify(function (file) {
      //   if (file.jshint.success) {
      //     return false;
      //   }
      //   var errors = file.jshint.results.map(function (data) {
      //     if (data.error) {
      //       return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
      //     }
      //   }).join("\n");
      //   return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
      // }))

      .pipe(concat('bundle.js')) // final output file name
      // .pipe(terser())
      .pipe(sourcemaps.write('.'))
      // .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function javascriptmin() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js')) // final output file name
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}


function watchArchivos() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.js, javascriptmin );
    watch( paths.imagenes, imagenes );
    watch( paths.imagenes, versionWebp );
}

exports.css = css;
exports.js = javascript;
exports.imagenes = series(imagenes, versionWebp);
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascriptmin, javascript, watchArchivos ); 