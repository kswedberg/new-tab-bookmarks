var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var yargs = require('yargs');
var argv = yargs.option('verbose', {
  alias: 'v',
  default: false
}).argv;


var rules = [
  {
    test: /\.jsx?$/,
    include: [
      /app\/.*\/js/,
      /fmjs/,
    ],
    loader: 'babel-loader',
  },

  // {
  //   test: /\.css$/,
  //   loader: ExtractTextPlugin.extract({
  //     fallback: 'style-loader',
  //     use: 'css-loader'
  //   }),
  // },
  // {
  //   test: /\.(jpg|png|gif|svg)$/,
  //   loader: 'file-loader'
  // },
];

var exposeLoaders = [
  {
    test: 'jquery',
    use: [
      'expose-loader?$',
      'expose-loader?jQuery'
    ],
  },
];

exposeLoaders.forEach(function(item) {
  try {
    var test = require.resolve(item.test);

    item.test = test;
    rules.push(item);
  } catch (e) {
    if (argv.verbose) {
      console.log(`Skipping "${item.loader}". Webpack loader not found.`);
    }
  }
});

var webpackConfig = {
  entry: {
    bookmarks: ['./app/js/bookmarks.js'],
    'custom-options': [
      './app/js/custom-options.js'
    ],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(process.cwd(), 'public/js'),
  },
  resolve: {
    modules: [
      'node_modules',
      // path.join(config.paths.srcAssets, 'js'),
      // config.paths.srcAssets,
      // path.join(config.paths.src, 'views'),
    ],
  },
  module: {
    rules: rules,
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new webpack.BannerPlugin({
      banner: 'Built by Fusionary (fusionary.com)',
      entryOnly: true
    })
  ]
};

let envPlugins = [];

webpackConfig.devtool = 'cheap-module-source-map';
envPlugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true
  })
];

// if (process.env.BUILD_ENV === 'development') {
//   webpackConfig.devtool = 'cheap-module-source-map';
//   envPlugins = [
//     new webpack.LoaderOptionsPlugin({
//       debug: true
//     })
//   ];
// } else {
//   let uglifyOptions = {
//     compress: {
//       warnings: false,
//       drop_console: true // eslint-disable-line camelcase
//     },
//   };
//
//   envPlugins = [
//     // Apparently some libs (React) may use process.env.NODE_ENV, so we better set it.
//     // https://github.com/facebook/react/blob/master/docs/docs/getting-started.md#using-react-from-npm
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: JSON.stringify('production')
//       }
//     }),
//     // new webpack.optimize.UglifyJsPlugin(uglifyOptions)
//   ];
// }

webpackConfig.plugins.push(...envPlugins);

module.exports = webpackConfig;
