const cssVariables = require('./cssVariables');
/**
 * PostCSS Plugins
 * ---------------------------------------------------------------
 */
module.exports = function() {
  return [
    require('postcss-nested')(),
    require('postcss-simple-vars')({
      /**
       * Default variables. Should be overridden in main build system
       * @type {Object}
       */
      variables: cssVariables()
    }),
    require('postcss-color-hex-alpha')(),
    require('postcss-color-function')(),
    require('postcss-calc')(),
    require('autoprefixer')()
  ];
};
