'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { NamedModulesPlugin, HotModuleReplacementPlugin } = webpack;
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'happypack/loader?id=tsx',
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
    new HappyPack({
      id: 'tsx',
      loaders: [{
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
        }
      }],
      threadPool: happyThreadPool,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 9000,
  },
};
