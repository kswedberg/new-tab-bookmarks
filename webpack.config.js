const path = require('path');
const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const wextManifest = require('wext-manifest');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const {VueLoaderPlugin} = require('vue-loader');
const WriteWebpackPlugin = require('write-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const manifestInput = require('./src/manifest.js');

const targetBrowser = process.env.TARGET_BROWSER;
const manifest = wextManifest[targetBrowser](manifestInput);

const getExtensionFileType = () => {
  if (targetBrowser === 'opera') {
    return 'crx';
  }
  if (targetBrowser === 'firefox') {
    return 'xpi';
  }

  return 'zip';
};

const transformHtml = (content) => {
  return ejs.render(content.toString(), {
    ...process.env,
  });
};

const config = {
  performance: {
    maxEntrypointSize: 700000,
    maxAssetSize: 500000,
  },
  mode: process.env.NODE_ENV,
  context: `${__dirname}/src`,
  entry: {
    background: './background.js',
    'popup/popup': './popup/popup.js',
    'options/options': './options/options.js',
    'tab/tab': './tab/tab.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist', targetBrowser),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/images/',
          emitFile: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `dist/${targetBrowser}`),
        path.join(process.cwd(), `dist/${targetBrowser}.${getExtensionFileType()}`),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new HtmlWebpackPlugin({
      template: 'templates/default.ejs',
      title: 'New Tab Bookmarks',
            // inject: false,
      chunks: ['tab/tab'],
      filename: 'tab/tab.html',
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    new CopyWebpackPlugin([
      {from: 'icons', to: 'icons', ignore: ['.DS_Store']},
      {from: 'fonts', to: 'fonts', ignore: ['.DS_Store']},
      {from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml},
      {from: 'options/options.html', to: 'options/options.html', transform: transformHtml},
      // {from: 'tab/tab.html', to: 'tab/tab.html', transform: transformHtml},
    ]),
    new WriteWebpackPlugin([{name: manifest.name, data: Buffer.from(manifest.content)}]),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
};

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ]);

  config.optimization.minimizer.push(new ZipPlugin({
    path: path.resolve(__dirname, 'dist'),
    extension: `${getExtensionFileType()}`,
    filename: `${targetBrowser}`,
  }));
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      extensionPage: [
        'popup/popup.js',
        'options/options.js',
        'tab/tab.js',
      ],
      // manifest: `${__dirname}/src/manifest.json`,
    }),
  ]);
}


module.exports = config;
