const OpenProps = require('open-props')
const postcssCustomMedia = require('postcss-custom-media')
const postcssJitProps = require('postcss-jit-props')

module.exports = {
  plugins: [postcssCustomMedia, postcssJitProps(OpenProps)],
}
