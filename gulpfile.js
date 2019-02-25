const gulp = require("gulp");
const debug = require("gulp-debug");
const sass = require("gulp-sass");
const nunjucks = require("gulp-nunjucks-render");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

gulp.task("nunjucks", cb => {
  gulp
    .src("src/templates/*.html")
    .pipe(debug({ title: "nunjucks templates:" }))
    .pipe(
      nunjucks({
        path: [
          "src/templates/chunks",
          "src/templates/chunks/promo",
          "src/templates/layout"
        ]
      })
    )
    .pipe(debug({ title: "nunjucks result:" }))
    .pipe(gulp.dest("dist"));
  browserSync.reload();
  cb();
});

gulp.task("sass", () => {
  return gulp
    .src("./src/sass/style.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("concat_js", () => {
  return gulp
    .src([
      "./src/scripts/**/*.js",
      "./node_modules/bootstrap/dist/js/bootstrap.js"
    ])
    .pipe(concat("all.js"))
    .pipe(gulp.dest("./dist/scripts"));
});

gulp.task("copy_images", () => {
  return gulp
    .src("./src/images/**/*")
    .pipe(debug({ title: "copy images:" }))
    .pipe(gulp.dest("./dist/images"));
});

gulp.task("copy_fonts", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(debug({ title: "copy fonts:" }))
    .pipe(gulp.dest("./dist/fonts"));
});

gulp.task("copy", cb => {
  gulp.parallel("copy_fonts", "copy_images")(cb);
});

gulp.task("bs", function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch("src/sass/**/*.scss", gulp.parallel("sass"));
  gulp.watch("src/templates/**/*.html", gulp.parallel("nunjucks"));
});
