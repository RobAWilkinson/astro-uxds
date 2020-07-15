const path = require('path');
const PostCSSPresetEnv = require('postcss-preset-env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  watch: true,
  stats: { colors: true },
  // Can't use faster eval due to a bug with MiniCssExtractPlugin
  // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
  devtool: 'cheap-module-source-map',
  // entry: [
  //   path.resolve(__dirname, 'astrouxds/rux-button.js'),
  //   // path.resolve(__dirname, 'vendor/styles/index.scss')
  // ],
  entry: {
    'rux-button/rux-button': path.resolve(__dirname, 'node_modules/@astrouxds/rux-button/rux-button.js'),
    'rux-icon/rux-icon': path.resolve(__dirname, 'node_modules/@astrouxds/rux-icon/rux-icon.js'),
    'astro.core.min': path.resolve(__dirname, 'node_modules/@astrouxds/rux-static/css/astro.core.min.css')
},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '_site/astrouxds'),
    publicPath: '/astrouxds/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // Will create a `webpack.njk` with the css/jss files
    // that then gets picked up by eleventy
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'webpack.html'),
      filename: path.resolve(__dirname, '_includes/webpack.njk'),
      // Hash is used for cache busting the generated webpack.html
      // while keeping the same file name in the output
      hash: true,
      inject: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            // Does not respect devtools option
            // https://github.com/webpack-contrib/css-loader/issues/622
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [PostCSSPresetEnv],
              // Does not respect devtools option
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash].[ext]',
              outputPath: 'images'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  // optimization: {
  //   splitChunks: {
  //       chunks: 'all',
  //       cacheGroups: {
  //           vendors: {
  //               test: /[\\/]node_modules[\\/]/,
  //               priority: -10
  //           },
  //       }
  //   }
  // }
};