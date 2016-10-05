'use strict';
var vueCompiler = require('vue-template-compiler');
var sass = require('node-sass');
var less = require('less');

function hack(fn) {
  return `return Function(${JSON.stringify(fn)}).call(this)`;
}

module.exports = options => {
  var c = 0;
  return {
    transform: (code, id) => {
      if (id.match(/vue\..*js$/i)) {
        return code.replace(/'use strict';/, `'use strict'; \n var process = {env:{}};`);
      }
      if (!id.match(/\.vue$/i)) return code;

      const sfc = vueCompiler.parseComponent(code);
      const compiled = vueCompiler.compile(sfc.template.content);
      const template = hack(compiled.render);
      const staticRenderFns = compiled.staticRenderFns.map(fn => `function() { ${hack(fn)} }`);
      var script = sfc.script ? sfc.script.content : 'export default {}';
      const scopeId = 'data-v-' + (++c);
      const addStyles = (sfc.styles || []).map(style => {
        var css = style.content;
        if (style.lang === 'sass') {
          css = sass.renderSync({
            data: css,
            outputStyle: 'compressed'
          }).css.toString();
        } else if (style.lang === 'less') {
          less.render(css, (e, output) => css = output.css);
        }
        if (style.scoped) {
          css = css.replace(/ *\{/, `[${scopeId}]{`);
        }
        return `var style = document.createElement('style'); 
          style.type = 'text/css';
          var css = \`${css}\`;
          if (style.styleSheet){
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }
          document.head.appendChild(style);`;
      }).join('');
      return script.replace(/default {/, `default {
      _scopeId: '${scopeId}', 
      staticRenderFns: [${staticRenderFns.join(',')}],
      render: function() { ${addStyles}; ${template} },`);
    }
  }
};
