const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/App",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    open: true,
    inline: true,
    port: 9191
  },
  mode: "development",

  optimization: {
    minimize: false
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["react"]
          }
        }
	  },
	//   {
	// 	test: /\.(scss)$/,
	// 	use: ['css-hot-loader'].concat(extractSCSS.extract({
	// 	  fallback: 'style-loader',
	// 	  use: [
	// 		{
	// 		  loader: 'css-loader',
	// 		  options: {alias: {'../img': '../public/img'}}
	// 		},
	// 		{
	// 		  loader: 'sass-loader'
	// 		}
	// 	  ]
	// 	}))
	//   },
    ]
  },

  plugins: [new webpack.HotModuleReplacementPlugin()]
};
