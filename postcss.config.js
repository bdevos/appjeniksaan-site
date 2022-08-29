// const OpenProps = require('open-props')

// require('open-props/src/extra')

const postcssCustomMedia = require('postcss-custom-media')
// const postcssJitProps = require('postcss-jit-props')

const postcssJitProps = require('postcss-jit-props')
const OpenProps = require('open-props')

module.exports = {
  plugins: [postcssCustomMedia, postcssJitProps(OpenProps)],
}
