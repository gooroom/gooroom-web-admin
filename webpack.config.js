const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].styles.css');

const BUILD_DIR = path.resolve(__dirname, 'build');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (env = {}) => {
  return {

    entry: {
      index: [SRC_DIR + '/index.js']
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].bundle.js'
    },
  
    devServer: {
      contentBase: BUILD_DIR,
      hot: true,
      open: true,
      inline: true,
      port: 9191
    },
  
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: ['css-hot-loader'].concat(extractSCSS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {alias: {'../img': '../public/img'}}
              },
              {
                loader: 'sass-loader'
              }
            ]
          }))
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.css$/,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['env', 'react', 'stage-2'],
              plugins: ['babel-plugin-transform-object-rest-spread']
            }
          }
        }
      ]
    },
  
    plugins: [new webpack.HotModuleReplacementPlugin(),
      extractCSS,
      extractSCSS,
      new HtmlWebpackPlugin({
        inject: true,
        template: './public/index.html'
      })
    ]
  
  }
};
