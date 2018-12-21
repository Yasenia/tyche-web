'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const os = require('os');
const path = require('path');

const { NamedModulesPlugin, HotModuleReplacementPlugin, WatchIgnorePlugin } = webpack;
const happyPackThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1});

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename: "[name].[chunkhash:6].js"
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'happypack/loader?id=tsx',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: 'happypack/loader?id=styles',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: "url-loader?limit=8192",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, './')
    }),
    new HtmlWebpackPlugin({
      title: 'tyche',
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
    new WatchIgnorePlugin([/css\.d\.ts$/]),
    new HappyPack({
      id: 'tsx',
      loaders: ['ts-loader?happyPackMode'],
      threadPool: happyPackThreadPool,
    }),
    new HappyPack({
      id: 'styles',
      loaders: [
        "style-loader",
        "typings-for-css-modules-loader?modules&namedExport&camelCase&localIdentName=[local]--[hash:base64:4]",
        "sass-loader",
      ],
      threadPool: happyPackThreadPool,
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 9000,
  },
  optimization: {
    runtimeChunk: {
      name: "runtime"
    },
    splitChunks: {
      cacheGroups: {
        "nameplate": {
          name: "nameplate",
          chunks: "all",
          test: /[\\/]data[\\/]/,
          minSize: 0,
          priority: 10,
        },
        vendors: {
          name: "vendors",
          chunks: "all",
          test: /[\\/]node_modules[\\/]/,
          priority: 10
        },
      }
    }
  }
};
