/* jshint node:true */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LessRewriteImportPlugin = require('less-plugin-rewrite-import');
var argv = require('minimist')(process.argv.slice(2));
var merge = require('webpack-merge');

var pgk = require('./package.json');

function rewriteUrl(replacePath) {
  return function (req, opt) {  // gets called with request and proxy object
    var queryIndex = req.url.indexOf('?');
    var query = queryIndex >= 0 ? req.url.substr(queryIndex) : '';
    req.url = req.path.replace(opt.path, replacePath) + query;
  };
}

var definePlugin = new webpack.DefinePlugin({
  VERSION: JSON.stringify(pgk.version),
  PRODUCTION: !!argv.p,
  DEVELOPMENT: !!argv.debug,
  LINDAT: (process.env.THEME == 'LINDAT'),
  LDC: (process.env.THEME == 'LDC'),
  BASE: JSON.stringify((process.env.THEME == 'LINDAT') ? '/services/pmltq/' : ((process.env.THEME == 'LDC') ? '/ldc/' : '/')),
  BASEAPI: JSON.stringify((process.env.THEME == 'LDC') ? '/ldc/services/pmltq/api' : '/services/pmltq/api')
});

var definitions = definePlugin.definitions;

var config = {
  devtool: 'source-map',
  entry: {
    pmltq: './app/pmltq.js',
    admin: './app/admin/index.js'
  },
  output: {
    devtoolModuleFilenameTemplate: 'pmtlq-web:///[resource-path]?[loaders]',
    path: path.join(__dirname, 'dist'),
    filename: '[hash]-[name].js'
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
    loaders: [
      {test: /\.yml/, loader: 'json!yaml'},
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader']},
      {test: /node_modules\/admin-config\/.*\.jsx?$/, loader: 'babel'},
      {test: /\.html$/, loader: 'html'},
      {test: /\.jade$/, loader: 'jade', query: definitions},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
      {test: /\.(woff|woff2)$/, loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'},
      {test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'},
      {test: /\.eot$/, loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'},
      {test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml&prefix=fonts'},
      // See https://github.com/adobe-webplatform/Snap.svg/issues/341 and remove once it's fixed
      {test: require.resolve('snapsvg'), loader: 'imports-loader?this=>window,fix=>module.exports=0'},
      {test:   /\.md/, loader: 'markdown-it'},
      {test:   /\.json/, loader: 'json-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(), // NOT IN WEBPACK v4
    new webpack.PrefetchPlugin('angular'),
    new webpack.PrefetchPlugin('babel-polyfill'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app', 'index.jade'),
      chunks: ['pmltq']
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: path.join(__dirname, 'app', 'admin', 'index.jade'),
      chunks: ['admin']
    }),
    definePlugin
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
    proxy: {
      '/api': {
      pathRewrite: function (path, req) { return path.replace('/api', '/v1') },
      target: 'http://localhost:3000/'
      }
    }
  }
};

if (definitions.PRODUCTION) {
  // Use extract only for production
  module.exports = merge(config, {
    externals: [{
      jquery: 'jQuery',
      angular: 'angular'
    }],
    module: {
      loaders: [
        {test: /\.less$/, loader: ExtractTextPlugin.extract('css!autoprefixer!less')},
        {test: /\.css$/, loader: ExtractTextPlugin.extract('css!autoprefixer')}
      ]
    },
    plugins: [
      new ExtractTextPlugin('[contenthash]-[name].css', {
        allChunks: true
      }),
      /*new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        exclude: [/ng-admin/]
      }),
      new webpack.NoErrorsPlugin()*/]
  });
} else {
  module.exports = merge(config, {
    devtool: 'eval',
    output: {
      pathinfo: true
    },
    module: {
      loaders: [
        {test: /\.less$/, loader: 'style!css!autoprefixer!less'},
        {test: /\.css$/, loader: 'style!css!autoprefixer'}
      ]
    }
  });
}
