/* jshint node:true */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LessRewriteImportPlugin = require('less-plugin-rewrite-import');

var pgk = require('./package.json');

function rewriteUrl(replacePath) {
  return function (req, opt) {  // gets called with request and proxy object
    var queryIndex = req.url.indexOf('?');
    var query = queryIndex >= 0 ? req.url.substr(queryIndex) : '';
    req.url = req.path.replace(opt.path, replacePath) + query;
  };
}

var defines = new webpack.DefinePlugin({
  VERSION: JSON.stringify(pgk.version),
  PRODUCTION: process.env.NODE_ENV === 'production',
  DEVELOPMENT: process.env.NODE_ENV !== 'production',
  LINDAT: true
});

module.exports = {
  debug: true,
  devtool: 'cheap-source-map',
  entry: ['./app/pmltq.js', './app/pmltq.less'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[hash]-pmltq.js'
  },
  externals: [{
    eve: 'eve'
  }],
  resolve: {
    alias: {
      jQuery: 'jquery'
    }
  },
  module: {
    //preLoaders: [{test: /\.js$/, loaders: ['jscs']}],
    postLoaders: [{
      test: /\.js$/,
      exclude: /\/(node_modules|bower_components)\//,
      loader: 'autopolyfiller',
      query: {browsers: ['last 2 versions', 'ie >= 9']}
    }],
    loaders: [
      {test: /\.less$/, loader: ExtractTextPlugin.extract('css!autoprefixer!less')},
      {test: /\.yml/, loader: 'json!yaml'},
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader']},
      {test: /node_modules\/admin-config\/.*\.jsx?$/, loader: 'babel'},
      {test: /\.html$/, loader: 'html'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('css!autoprefixer')},
      {test: /\.jade$/, loader: 'jade', query: defines.definitions},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'},
      {test: /\.eot$/, loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml&prefix=fonts'},
      // See https://github.com/adobe-webplatform/Snap.svg/issues/341 and remove once it's fixed
      {test: require.resolve('snapsvg'), loader: 'imports-loader?this=>window,fix=>module.exports=0'}
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app', 'index.jade')
    }),
    new ExtractTextPlugin('[contenthash]-[name].css', {
      allChunks: true
    }),
    defines
  ],
  lessLoader: {
    lessPlugins: [
      new LessRewriteImportPlugin({
        paths: {
          '../../theme.config': path.join(__dirname, 'app', 'theme.config'),
          'app/theme/globals/site': path.join(__dirname, 'app', 'theme', 'globals', 'site')
        }
      })
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    proxy: [{
      path: new RegExp('/api/(.*)'),
      rewrite: rewriteUrl('v1/$1'),
      target: 'http://localhost:3000/'
    }]
  }
};
