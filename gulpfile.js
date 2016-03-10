var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var shrink = require('gulp-cssshrink');

// 静态文件打包合并
var webpack = require('gulp-webpack');

//MD5戳
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence');

var config = require('./webpack.config');

gulp.task('js', function () {
  gulp.src('./js')
    .pipe(webpack(config))
    .pipe(gulp.dest('./build'));
});
