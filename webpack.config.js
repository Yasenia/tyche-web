'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { NamedModulesPlugin, HotModuleReplacementPlugin, WatchIgnorePlugin } = webpack;

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
        use: [
          "style-loader",
          "typings-for-css-modules-loader?modules&namedExport&camelCase",
          "sass-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
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
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 9000,
  },
};
