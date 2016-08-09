# vuetwo 

> Proof of concept Vue 2 builder

Convert .vue-files to one single .js-file.  
Script is transpiled with babel 6, style with either css, sass or less.

## Install

```
$ npm install --save https://github.com/eirikb/vuetwo
```

## Usage
```
  Usage
    $ vuetwo <input> <output>

  Options
    -m, --minify Minify output
    -w, --watch Watch for file changes

  Examples
    $ vuetwo src/app.js build.js -m -w
```

## Demo

See **[this gist](https://gist.github.com/eirikb/ea54a045e800e2aa3c3b0d5080911075)** for demo.

## License

MIT © Eirik Brandtzæg
