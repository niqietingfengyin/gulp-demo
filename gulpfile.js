var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var md5 = require('gulp-md5');
var through = require('through2');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//监控同步刷新ok
gulp.task('server',function(){
    browserSync.init({
       server:{
            baseDir:'./',
            index:'./source/test.html'
        }
       // proxy:'ot.wap.sogou.com'
    });
    gulp.watch('source/sass/**/*.scss',['sass']);
  //  gulp.watch('source/sass/**/*.scss',['sass']).on('change',browserSync.reload);
});
gulp.task('sass',function(){
    return gulp.src('source/sass/**/*.scss',{base:'source/sass'})
        .pipe(sass())
        .pipe(gulp.dest('1001/dev/css'))
        .pipe(browserSync.stream());
});
// gulp.watch举例ok
gulp.task('watch',function(){
    gulp.watch('source/sass/**/*.scss',['sass']).on('change',function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


//gulp.src , option举例ok
gulp.task('copy',function(){
    gulp.src('source/wapvr/**/readme.txt')
        .pipe(gulp.dest('1001/'));  // 1001/module/readme.txt

    gulp.src('source/wapvr/**/readme.txt',{base:'source'})
        .pipe(gulp.dest('1001/'));   //  1001/wapvr/module/readme.txt
});
gulp.task('uglify',function(){
    gulp.src('./source/**.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(md5({size:'8',separator: '.'}))
        .pipe(gulp.dest('./1001/js/'));
});



// gulp.src是异步执行的，需要用return确认何时执行完毕 ；ok
gulp.task('cp',function(){
    return gulp.src('source/file.txt')
        .pipe(gulp.dest('1001/'));
});
gulp.task('replace',['cp'], function(){
    return gulp.src('1001/file.txt', {base : './1001' })
        .pipe(replace('world', 'yyyy'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('default',['cp','replace']);



//copy ued and images,,ok
var imageFiles = [];
gulp.task('copyuedandimages',function(){
    return gulp.src('./source/vr-weather.css')
        .pipe(getImagesFromCss())
        .pipe(gulp.dest('1001/dev/css/'));
});
function getImagesFromCss(){
    return through.obj(function(file,enc,cb){
        var value = file.contents.toString();
        var reg = /\.\.\/images\/([^)\s;'"$]*)/gi;
        var array = reg.exec(value);
        while (array) {
            imageFiles.push("images/" + array[1]);
            array = reg.exec(value);
        }
        if(imageFiles.length > 0){
            gulp.src(imageFiles, {cwd:'./source/**'})
                .pipe(gulp.dest('1001/dev/'));
        }
        cb(null,file);
    });
}


