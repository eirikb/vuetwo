var parts = process.argv.slice(2);
var input = parts[0];
var output = parts[1];
var rollup = require('rollup');
var plugin = require('./plugin.js');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

var watch = require('rollup-watch');

watch(
  rollup, {
    entry: input,
    plugins: [
      plugin(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
    ],
    dest: output
  }
).on('event', e => console.log(e));
