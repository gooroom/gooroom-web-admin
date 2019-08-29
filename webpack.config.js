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

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules', path.resolve(__dirname, 'src/lib')]
    },

    entry: {
      index: [SRC_DIR + '/index.js']
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].bundle.js'
    },
  
    devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
      contentBase: BUILD_DIR,
      hot: true,
      open: true,
      inline: true,
      port: 9191,
	    proxy: [{
        context: [
            '/gpms'
        ],
        target: `http://127.0.0.1:8080`,
        secure: false,
        changeOrigin: false,
        headers: { host: 'localhost:9191' }
      }],
      watchOptions: {
          ignored: /node_modules/
      }
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
  
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          BUILD_DATE: `'${new Date().toISOString().slice(4,10).replace(/-/g,"")}'`,
          VERSION: `'v1.3'`
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
      extractCSS,
      extractSCSS,
      new HtmlWebpackPlugin({
        inject: true,
        template: './public/index.html'
      })
    ]
  
  }
};
