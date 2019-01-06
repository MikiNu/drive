const path = require('path')
// const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // плагин минимизации
const VueLoaderPlugin = require('vue-loader/lib/plugin') // плагин для загрузки кода Vue

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js',
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            loaders: {
              js: 'babel-loader!eslint-loader',
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [ // use `include` vs `exclude` to white-list vs black-list
          path.resolve(__dirname, 'src'), // white-list your app source files
          require.resolve('bootstrap-vue'), // white-list bootstrap-vue
        ],
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new UglifyJSPlugin(),
    new VueLoaderPlugin(),
  ],
}
