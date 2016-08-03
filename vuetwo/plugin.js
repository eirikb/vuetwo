var vueCompiler = require('vue-template-compiler');
var sass = require('node-sass');
var less = require('less');

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
      const template = `return Function(${JSON.stringify(compiled.render)}).call(this)`;
      const staticRenderFns = compiled.staticRenderFns.map(fn => `function() { ${fn} }`);
      let script = sfc.script ? sfc.script.content : 'export default {}';
      const scopeId = 'data-v-' + (++c);
      const addStyles = (sfc.styles || []).map(style => {
        let css = style.content;
        if (style.lang === 'sass') {
          css = sass.renderSync({data: css}).css.toString();
        } else if (style.lang === 'less') {
          less.render(css, (e, output) => css = output.css);
        }
        if (style.scoped) {
          css = `*[${scopeId}] ${css}`;
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
