const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { generateEntries } = require('./mutiple-entry')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

console.log('123',process.env.BASE_URL)

module.exports = {
  publicPath: IS_PROD ? process.env.BASE_URL : '/',   // 打包后，需要使用絕對路徑
  productionSourceMap: false,
  pages: generateEntries(),
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  // lintOnSave:false,
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@buy', resolve('src/pages/buy'))
      .set('@rent', resolve('src/pages/rent'))
      .set('@index', resolve('src/pages/index'))
      .set('@common', resolve('src/components'))

    if (!IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].js' : '[name]/[name].js'
        })
    }

    if (IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].[contenthash:8].js' : '[name]/[name].[contenthash:8].js'
        })
        // 加上就打包失败 具体原因未知
      // config.plugin('extract-css').use(MiniCssExtractPlugin, [
      //   {
      //     filename: bundle => {
      //       return bundle.chunk.name === 'index' ? 'css/[name].[contenthash:8].css' : '[name]/[name].[contenthash:8].css'
      //     },
      //     chunkFilename: 'css/[name].[contenthash:8].css'
      //   }
      // ])
      
      config.plugin('mini-css-extract-plugin').use(MiniCssExtractPlugin, [{
        filename: '[name]/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }]).end();
      
      
    }
  }
}
