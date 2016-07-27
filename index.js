const fs = require('fs');
const vueCompiler = require('vue-template-compiler');

var file = fs.readFileSync('./src/app.vue').toString();


const parsed = vueCompiler.parseComponent(file);
console.log(parsed);
// const compiled = vueCompiler.compile(file);
// console.log(compiled);
