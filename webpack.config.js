var path = require('path');
var webpack = require('webpack');
var yargs = require('yargs');
const BabiliPlugin = require('babili-webpack-plugin');

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
  {
    test: require.resolve('jquery'),
    use: [
      'expose-loader?$',
      'expose-loader?jQuery'
    ],
  },
];

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
    ],
  },
  module: {
    rules: rules,
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.BannerPlugin({
      banner: 'Built by Karl Swedberg (https://karlswedberg.com)',
      entryOnly: true
    })
  ]
};

let envPlugins = [];

if (process.env.NODE_ENV === 'production') {
  let uglifyOptions = {
    compress: {
      warnings: false,
      drop_console: true // eslint-disable-line camelcase
    },
  };

  envPlugins = [
    // Apparently some libs (React) may use process.env.NODE_ENV, so we better set it.
    // https://github.com/facebook/react/blob/master/docs/docs/getting-started.md#using-react-from-npm
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new BabiliPlugin({
      mangle: {
        blacklist: ['jQuery', '$']
      }
    }),
  ];

} else {
  webpackConfig.devtool = 'cheap-module-source-map';
  envPlugins = [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ];
}

webpackConfig.plugins.push(...envPlugins);

module.exports = webpackConfig;
