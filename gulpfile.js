var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');

gulp.task('default', ['copy'], function () {
  /* as 3 funções abaixo não tem retorno, então elas são executadas assincronamente */
  /* uma não depende da outra */
  gulp.start('build-img', 'build-js', 'build-html')
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

/* concatena todos os arquivos compilados js num único arquivo */
/* os arquivos são listado para a importação acontecer nessa ordem */
gulp.task('build-js', function () {
  gulp.src(['dist/js/jquery.js', 'dist/js/print-a.js', 'dist/js/print-b.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
})

/* substitui a importação de todos os arquivos js no html pelo concatenado */
gulp.task('build-html',  function() {
  gulp.src('dist/**/*.html')
    .pipe(htmlReplace({
      js: 'js/all.js'
    }))
    .pipe(gulp.dest('dist'))
})