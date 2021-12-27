var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var terser = require('gulp-terser');
var usemin = require('gulp-usemin');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');

gulp.task('default', ['copy'], function () {
  /* as 3 funções abaixo não tem retorno, então elas são executadas assincronamente */
  /* uma não depende da outra */
  gulp.start('build-img', 'usemin')
})

//copia tudo da pasta 'src' para a pasta 'dist'
gulp.task('copy', ['clean'] ,function () {
  //se não houver o return, as tasks 'copy' e 'build-img' rodaram em simultaneo, contudo 'build-img 'só pode rodar depois de 'copy' finalizado
  return gulp.src('src/**/*')
    .pipe(gulp.dest('dist'))
})

//exclui a pasta 'dist'
gulp.task('clean', function () {
  //se não houver o return, as tasks 'copy' e 'clean' rodaram em simultaneo, contudo 'copy 'só pode rodar depois de 'clean' finalizado
  return gulp.src('dist').pipe(clean())
})

//minifica as imagens da pasta 'img'
gulp.task('build-img', function () {
  gulp.src('dist/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
})

gulp.task('usemin', function() {
 gulp.src('dist/**/*.html')
  .pipe(usemin({
    'js': [terser],
    'css': [autoprefixer({browsers: ['last 40 versions']}), cssmin]
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
  //trata erros de js
  gulp.watch('src/js/*.js').on('change', function(event) {
    gulp.src(event.path)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
  });
  //compila less
  gulp.watch('src/less/*.less').on('change', function(event) {
    console.log('Compilando arquivo: ' + event.path)
    gulp.src(event.path)
    .pipe(less().on('error', function(error) {
      console.log('Problema na compilação');
      console.log(error.message);
    }))
    .pipe(gulp.dest('src/style'))
  });
  //trata erros de css
  gulp.watch('src/style/*.css').on('change', function(event) {
    gulp.src(event.path)
    .pipe(csslint())
    .pipe(csslint.reporter())
  });
  gulp.watch('src/**/*').on('change', browserSync.reload);
})