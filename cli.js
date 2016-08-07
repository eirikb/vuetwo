#!/usr/bin/env node
'use strict';
var meow = require('meow');
var vuetwo = require('./index.js');

var cli = meow([
	'Usage',
	'  $ vuetwo <input> <output>',
	'',
	'Options',
	'  -m, --minify Minify output',
	'  -w, --watch Watch for file changes',
	'',
	'Examples',
	'  $ vuetwo src/app.js build.js -m -w'
], {
    alias: {
        m: 'minify',
        w: 'watch'
    }
});

if (cli.input.length < 2) {
    cli.showHelp();
} else {
    vuetwo(cli.input[0], cli.input[1], cli.flags);
}