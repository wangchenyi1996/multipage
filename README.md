
## Features

- 打包后保持按页面输出
- 每个页面有自己的css & js
- 公共的js & css 在对应目录
- 默认index页面打平构建

## Mutiple Setting
```js
const path = require('path')
const glob = require('glob')

const generateEntries = () => {
  // 默认查询多页面地址
  const PATH_ENTRY = path.resolve(__dirname, './src/pages')
  // 约定构建出的页面用folder名字，默认入口为每个页面的main.js
  const entryFilePaths = glob.sync(PATH_ENTRY + '/**/main.js')
  const entry = {}

  entryFilePaths.forEach((filePath) => {
    const FILENAME = filePath.match(/([^/]+)\/main\.js$/)[1]
    entry[FILENAME] = {
      entry: filePath,
      template: 'public/index.html',
      filename: FILENAME === 'index' ? `${FILENAME}.html` : `${FILENAME}/${FILENAME}.html`,
      // title可不传，每个页面单独设置
      title: `${FILENAME} Page`,
      chunks: ['chunk-vendors', 'chunk-common', FILENAME]
    }
  })

  return entry
}

module.exports = {
  generateEntries
}
```

## vue.config.js
```js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { generateEntries } = require('./mutiple-entry')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? process.env.BASE_URL : '/',
  productionSourceMap: false,
  pages: generateEntries(),
  devServer: {
    open: true
  },
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

    // dev环境js处理
    if (!IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].js' : '[name]/[name].js'
        })
    }

    // build环境js & css处理
    if (IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].[contenthash:8].js' : '[name]/[name].[contenthash:8].js'
        })

      config.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
          filename: bundle => {
            return bundle.chunk.name === 'index' ? 'css/[name].[contenthash:8].css' : '[name]/[name].[contenthash:8].css'
          },
          chunkFilename: 'css/[name].[contenthash:8].css'
        }
      ])
    }
  }
}
```

## Usage

``` bash

npm install

npm run serve

npm run build
```
