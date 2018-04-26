var gulp  = require('gulp');
var ts    = require('gulp-typescript');
var del   = require('del');

var tsProject = ts.createProject('./tsconfig.json');
var node;
var spawn = require('child_process').spawn;

function cleanServe() {
  return del('.tmp');
}

function compileTSServe(done) {
  var tsResult = tsProject.src()
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest( '.tmp' ));
  done();
}

function nodeStart(done) {
  if(node) node.kill();
  node = spawn('node', ['.tmp/server.js'], { stdio: 'inherit' });
  node.on( 'close', function( code ) {
    if( code === 8 ) {
      gulp.log( 'there is something leaking out of node, its gross' );
    }
  })
  done();
}

function watch() {
  gulp.watch('**/*.ts', {cwd: 'src'}, gulp.series(compileTSServe, nodeStart));
}

gulp.task('serve', gulp.series(cleanServe, compileTSServe, gulp.parallel(nodeStart, watch)));