import path from 'path';
import webpack from 'webpack';

import _ from 'lodash';

import Clean from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// Root app path
const rootDir = path.resolve(__dirname, '..');
const cleanDirectories = ['build', 'dist'];

// Plugins configuration
const plugins = [new webpack.NoErrorsPlugin()];

// Default value for development env
let outputPath = path.join(rootDir, 'build');
let suffix = 'dev';

const config = {
  resolve: {
    modulesDirectories: ['src', 'node_modules', 'local_modules'],
    extensions: ['', '.js'],
  },
  module: {
    postLoaders: [
      {
        test: /\.js$/,
        loader: 'ify',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015'],
        },
      },
      {
        test: /node_modules/,
        loader: 'ify',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
};

module.exports = function configuration(options) {
  const prod = options.production;
  const hash = prod ? '-[hash]' : '';
  const entryAppPath = [path.resolve(__dirname, '../src/app.js')];

  if (prod) {
    suffix = 'prod';
    outputPath = path.join(rootDir, 'dist');
    plugins.push(
            new webpack.optimize.UglifyJsPlugin({
              warnings: false,
              minimize: true,
              sourceMap: false,
            }),
        );
  }

  plugins.push(new Clean(cleanDirectories, rootDir));
  plugins.push(
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: `src/html/index.${suffix}.html`,
        }),
    );

  plugins.push(
        new CopyWebpackPlugin([
            { from: 'src/textures', to: 'textures' },
        ]),
    );

  plugins.push(
        new webpack.optimize.DedupePlugin(),
    );

  plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(true),
    );

  if (!prod) {
    entryAppPath.push('webpack/hot/dev-server');
  }

  return _.merge({}, config, {
    entry: {
      bundle: entryAppPath,
    },
    output: {
      path: outputPath,
      filename: `[name]${hash}.js`,
    },
    plugins,
  });
};
