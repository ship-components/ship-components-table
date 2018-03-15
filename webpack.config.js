const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postCssPlugins = require('./libs/postCssPlugins');

module.exports = {
  // Where to start
  entry: {
    App: path.resolve(__dirname, './src/Table.js')
  },

  // Where to output
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },

  externals: {
    classnames: true,
    react: 'React',
    'ship-components-outsideclick': true,
    'ship-components-icon': true,
    'react-addons-css-transition-group': true
  },

  module: {
    rules: [
      {
        test: /\.(jsx?|es6)$/,
        enforce: 'pre',
        include: /src\/.*/,
        use: 'eslint-loader'
      },
      // ES6/JSX for App
      {
        test: /\.(jsx?|es6)$/,
        exclude: [
          /node_modules/
        ],
        use: 'babel-loader'
      },
      {
        test: /\.(jsx?|es6)$/,
        include: [
          /ship-components-.*\/src/
        ],
        use: 'babel-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      // CSS Modules
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]--[local]'
              }
            },
            {
              // CSS Modules
              loader: 'postcss-loader',
              options: {
                plugins: () => postCssPlugins()
              }
            }
          ]
        })
      }
    ]
  },

  stats: {
    children: false,
    colors: true,
    modules: false,
    reasons: true
  },

  resolve: {
    extensions: ['.js', '.jsx', '.es6'],
    modules: [path.resolve(__dirname, './node_modules')]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        eslint: {
          // Strict linting enforcing
          failOnWarning: true
        }
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    })
  ],

  devtool: 'source-map'
};
