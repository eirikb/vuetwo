var rollup = require('rollup');
var plugin = require('./plugin.js');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var program = require('commander');
var watch = require('rollup-watch');

program.version('0.0.1')
  .option('-w, --watch', 'Watch file for changes')
  .option('-i, --input [value]', 'Input file')
  .option('-o, --output [value]', 'Output file')
  .option('-m, --minify [value]', 'Minify (uglify) output file')
  .parse(process.argv);

if (!program.input) {
  console.log('Missing input file (-i [value]), exiting');
  process.exit(1);
}

if (!program.output) {
  console.log('Missing output file (-o [value]), exiting');
  process.exit(1);
}

var options = {
  entry: program.input,
  plugins: [
    plugin(),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    babel({
      presets: ['es2015-rollup'],
      babelrc: false
        exclude: 'node_modules/**'
    }),
    program.minify ? uglify() : {}
  ],
};


if (program.watch) {
  options.dest = program.output;
  watch(rollup, options).on('event', e => console.log(e));
} else {
  console.log('Bundling...');
  rollup.rollup(options).then(bundle => {
    console.log('Writing file...');
    bundle.write({
      dest: program.output
    });
  }).catch(err => console.log(err));
}