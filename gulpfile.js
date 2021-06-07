let _dist = require("path").basename(__dirname); // вихідні файли
let _src = "src"; // ісходні файли

let path = {
    build: { // вихідні файли
        html: _dist + "/",
        css: _dist + "/css/",
        js: _dist + "/js/",
        img: _dist + "/",
        fonts: _dist + "/fonts/",
    },
    src: { // ісходні файли
        html: [_src + "/**/*.html", "!" + _src + "/**/_*.html"],
        css: _src + "/css/style.scss",
        js: _src + "/js/script.js",
        img: _src + "/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: _src + "/fonts/*.ttf",
    },
    watch: { // файли що міняються (для прослуховування)
        html: _src + "/**/*.html",
        css: _src + "/css/**/*.scss",
        js: _src + "/js/**/*.js",
        img: _src + "/**/*.{jpg,png,svg,gif,ico,webp}",
        // fonts: _src + "/fonts/*.ttf",
    },
    clean: "./" + _dist + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gorup_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin');

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + _dist + "/"
        },
        port: 3000,
        // proxy: require("path").basename(__dirname),
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
          }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(gorup_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(clean_css())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}

function clean() {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, img, fonts));
// let build = gulp.series(gulp.parallel(js, css, html, img, fonts));

let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;