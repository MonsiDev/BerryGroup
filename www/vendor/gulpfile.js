var gulp = require("gulp");
(browserSync = require("browser-sync").create()),
  (rename = require("gulp-rename")),
  (sass = require("gulp-sass")),
  (concat = require("gulp-concat")),
  // js
  (jsUglify = require("gulp-uglify")),
  //css
  // cssConcat   = require('gulp-concat-css'),
  (cleanCSS = require("gulp-clean-css")),
  //postCss
  (postcss = require("gulp-postcss")),
  (pcssCssnext = require("postcss-cssnext")),
  (pcssImport = require("postcss-import")),
  (pcssShort = require("postcss-short")),
  // перехват ошибок
  (util = require("gulp-util")),
  (plumber = require("gulp-plumber"));

var buildFolder = "../build/";
var templateFolder = "../";

var onError = function(error) {
  util.log(
    [(error.name + " in " + error.plugin).bold.red, "", error.message, ""].join(
      "\n"
    )
  );
  util.beep();
  this.emit("end");
};

gulp.task("browser-sync", [], function() {
  browserSync.init(null, {
    proxy: "berryapp.loc",
    browser: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    port: 8080,
    stream: true
  });
});

gulp.task("cssBuild", function() {
  var processors = [pcssImport, pcssShort, pcssCssnext];
  return (gulp
      .src(["src/css/index.css", "src/css/index.pcss", "src/css/index.scss"])
      .pipe(plumber({ errorHandler: onError }))
      .pipe(concat("build.css"))
      //.pipe(postcss(processors))
      .pipe(sass())
      .pipe(gulp.dest(buildFolder + "css"))
      .pipe(rename("build.min.css"))
      .pipe(cleanCSS())
      .pipe(gulp.dest(buildFolder + "css")) );
});

gulp.task("jsBuild", function() {
  return gulp
    .src(["src/libs/**/*.js", "src/js/**/*.js"])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat("build.js"))
    .pipe(gulp.dest(buildFolder + "js"));
  // .pipe(rename('build.min.js'))
  // .pipe(jsUglify())
  // .pipe(gulp.dest(buildFolder + 'js'));
});

gulp.task("jsCoreBuild", function() {
  return gulp
    .src("src/jscore/**/*.js")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat("core.js"))
    .pipe(gulp.dest(buildFolder + "js"));
  // .pipe(rename('core.min.js'))
  // .pipe(jsUglify())
  // .pipe(gulp.dest(buildFolder + 'js'));
});

gulp.task("watch", function() {
  gulp.watch("src/**/*.scss", ["cssBuild"]);
  gulp.watch("src/**/*.css", ["cssBuild"]);
  gulp.watch("src/**/*.pcss", ["cssBuild"]);
  gulp.watch(["src/js/**/*.js", "src/libs/**/*.js"], ["jsBuild"]);
  gulp.watch("src/jscore/**/*.js", ["jsCoreBuild"]);

  gulp.watch(buildFolder + "**/*").on("change", browserSync.reload);
  gulp.watch(templateFolder + "**/*.tpl").on("change", browserSync.reload);
});

gulp.task("default", ["browser-sync", "watch"]);
