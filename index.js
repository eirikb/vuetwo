'use strict';
var rollup = require('rollup');
var plugin = require('./plugin.js');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var json = require('rollup-plugin-json');
var watch = require('rollup-watch');

module.exports = (input, output, flags) => {
  var options = {
    useStrict: false,
    entry: input,
    plugins: [
      plugin(),
      json(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      babel({
        presets: ['es2015-rollup'],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      flags.minify ? uglify() : {}
    ],
  };

  if (flags.watch) {
    options.dest = output;
    watch(rollup, options).on('event', e =>  console.log(e));
  }
  else {
    console.log('Bundling...');
    rollup.rollup(options).then(bundle => {
      console.log('Writing file...');
      bundle.write({
        useStrict: false,
        dest: output
      });
    }).catch(err => console.log(err));
  }
};