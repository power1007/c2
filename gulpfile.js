
const { watch, dest, src, parallel, series , task } = require ('gulp');

var styleSrc= "./src/scss/main.scss"; 
var minify = require('gulp-minify-css');
var sass = require('gulp-sass'); 
var rename = require('gulp-rename'); 
var gulp_prefixer = require("gulp-autoprefixer"); 
var gulp_sourceMap = require('gulp-sourcemaps'); 
var cssDist = "./dist/css/"; 
var styleWatch = 'src/scss/*.scss'; 
var jsWatch = 'src/js/*.js'; 

var jsDist = "DIST/js";
var jsFile = ['main.js']; 
var JsFolder  = 'src/js/'
var source = require('vinyl-source-stream'); 
var buffer = require('vinyl-buffer'); 
var browserify = require('browserify'); 
var babelify =  require('babelify');
var uglify = require('gulp-uglify'); 
var browerSync = require('browser-sync'); 
//var reload = browerSync.reload; 
var htmlWatch = "src/**/*.html"; 
var htmlSrc= "src/**/*.html"; 
var htmlDist = "./dist"; 
var imgSrc = "src/images/**/*"; 
var imgDist = "dist/images"; 
var fontSrc = "src/font/**/*"; 
var fontDist = "dist/font"; 
var notify = require('gulp-notify')
var plumber = require ('gulp-plumber'); 
//creating task function compiling css
 function brower_sync(){
    browerSync.init({
        server:{
            baseDir:'./dist'
        },
        open:false, 
        injectChanges:true, 

       // proxy:"http://localhost/my_proj/"
    })
}

function reload(done){
    browerSync.reload(); 
    done(); 
}
 function css(done) {
     src(styleSrc)
    .pipe(sass({
        errLogToConsole:true, 
        outputStyle:'compressed'
    }))
    .pipe( gulp_prefixer(
     'last 2 versions'
    ))

    .on('error',console.error.bind(console))   
    .pipe(rename({ suffix: '.min'} ))
    .pipe(gulp_sourceMap.write('./'))
    .pipe(dest(cssDist))   
    .pipe(browerSync.stream())
    done(); 
}

 function script(done){  
        
        jsFile.map(function(entry){
            return browserify({
                entries:[JsFolder+entry]
            })
            .transform(babelify, {presets:['@babel/preset-env']})
            .bundle()
            .pipe(source(entry))
            .pipe(rename({suffix:'.min'}))
            .pipe(buffer())
            .pipe(gulp_sourceMap.init({loadMaps:true}))
            .pipe(uglify( ))
            .pipe(gulp_sourceMap.write('./'))
            .pipe(dest(jsDist))
            .pipe(browerSync.stream())   
    });
    done(); 
}


function trigger_plumber(src_file,dist_file){
    return src(src_file)
        .pipe(plumber())
        .pipe(dest(dist_file))
}

function image(done){
    trigger_plumber(imgSrc, imgDist)
    done(); 
}

function html(done){
    trigger_plumber(htmlSrc, htmlDist)
    done(); 
}
function font(done){
    trigger_plumber(fontSrc, fontDist)
    done(); 
}

function  watch_files(){
    watch(styleWatch, css)
    watch(jsWatch, series(script, reload)) 
    watch(imgSrc, series(image, reload))
    watch(fontSrc, series(font, reload))
    watch(htmlWatch, series(html, reload))
    src(jsDist+ "/main.min.js")
    .pipe(notify({"message": 'gulp is watching'}))


}


task('css', css);
task('script', script);
task('html', html);
task('font', font);
task('image', image);
task('default',  parallel(css, script , html, font,image) ); 

task('watch', parallel(brower_sync, watch_files  )); 