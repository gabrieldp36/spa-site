import gulp from 'gulp';
const { src, dest, watch, series } = gulp;

// Dependencias de CSS - SASS.
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemap from 'gulp-sourcemaps';
import cssnano from 'cssnano';
const sass = gulpSass(dartSass);

// Dependencias de imágenes.
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

export const css = () => {
    // Compilar SASS.
    // Pasos: 1.- Identificar archivo. 2.- Compilarlo. 3.- Guardarlo.
    return src('src/scss/app.scss') // 1.
    .pipe( sourcemap.init() )
    .pipe( sass( {outputStyle:'expanded'} ) ) // 2.
    .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
    .pipe( sourcemap.write('.') )
    .pipe( dest('build/css') ) // 3.
};

export const imagenes = () => {
    return  ( 
        src('src/assets/img/**/*')
        .pipe( imagemin() )
        .pipe( dest('build/assets/img') )
    );
};

export const convertirWebp = () => {
    const opciones = {quality : 50};
    return  ( 
        src('src/assets/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/assets/img') )
    );
};

export const convertirAvif = () => {
   const opciones = {quality : 50, method: 'ssim'};
    return  ( 
        src('src/assets/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/assets/img') )
    );
};

export const dev = () => {
    // Utilizamos un watch para estar atentos a los cambios que
    // se produzcan en el archivo .sass para compilarlos 
    // y reflejarlos y en pantalla.
    watch('src/scss/**/*.scss', css);
    watch('src/assets/img/**/*', imagenes);
};

export const start = series(css, dev);

export default series(imagenes, convertirWebp, convertirAvif, css, dev);