/* tslint:disable: variable-name max-line-length */
/**
 * Try to not make your own edits to this file, use the constants folder instead.
 * If more constants should be added file an issue or create PR.
 */
import 'ts-helpers';
import {
  DEV_PORT, PROD_PORT, EXCLUDE_SOURCE_MAPS, HOST, USE_DEV_SERVER_PROXY, DEV_SERVER_PROXY_CONFIG,
  DEV_SERVER_WATCH_OPTIONS, DEV_SOURCE_MAPS, PROD_SOURCE_MAPS, STORE_DEV_TOOLS, MY_COPY_FOLDERS, MY_VENDOR_DLLS,
  MY_CLIENT_PLUGINS, MY_CLIENT_PRODUCTION_PLUGINS, MY_CLIENT_RULES
} from './constants';

const {
        ContextReplacementPlugin,
        DefinePlugin,
        DllPlugin,
        DllReferencePlugin,
        ProgressPlugin,
        NoEmitOnErrorsPlugin
      } = require('webpack');

const CompressionPlugin  = require('compression-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const {ForkCheckerPlugin} = require('awesome-typescript-loader');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin     = require('webpack/lib/optimize/UglifyJsPlugin');

const {hasProcessFlag, root, testDll} = require('./helpers.js');

const EVENT      = process.env.npm_lifecycle_event;
const AOT        = EVENT.includes('aot');
const DEV_SERVER = EVENT.includes('webdev');
const DLL        = EVENT.includes('dll');
const HMR        = hasProcessFlag('hot');
const PROD       = EVENT.includes('prod');

let port: number;
if (PROD) {
  port = PROD_PORT;
} else {
  port = DEV_PORT;
}

const PORT = port;

console.log('PRODUCTION BUILD: ', PROD);
console.log('AOT: ', AOT);
if (DEV_SERVER) {
  testDll();
  console.log(`Starting dev server on: http://${HOST}:${PORT}`);
}

const CONSTANTS = {
  AOT:             AOT,
  ENV:             PROD ? JSON.stringify('production') : JSON.stringify('development'),
  HMR:             HMR,
  HOST:            JSON.stringify(HOST),
  PORT:            PORT,
  STORE_DEV_TOOLS: JSON.stringify(STORE_DEV_TOOLS)
};

const DLL_VENDORS = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/http',
  '@angular/material',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  '@ngrx/core',
  '@ngrx/core/add/operator/select.js',
  '@ngrx/effects',
  '@ngrx/router-store',
  '@ngrx/store',
  '@ngrx/store-devtools',
  '@ngrx/store-log-monitor',
  'ngrx-store-freeze',
  'ngrx-store-logger',
  'rxjs',
  ...MY_VENDOR_DLLS
];

const COPY_FOLDERS = [
  {from: 'src/assets', to: 'assets'},
  {from: 'node_modules/hammerjs/hammer.min.js'},
  {from: 'node_modules/hammerjs/hammer.min.js.map'},
  ...MY_COPY_FOLDERS
];

if (!DEV_SERVER) {
  COPY_FOLDERS.unshift({from: 'src/index.html'});
} else {
  COPY_FOLDERS.push({from: 'dll'});
}

const clientConfig = function webpackConfig (): WebpackConfig {
  let config: WebpackConfig = Object.assign({});

  config.module = {
    rules: [
      {
        test:    /\.js$/,
        loader:  'source-map-loader',
        exclude: [EXCLUDE_SOURCE_MAPS]
      },
      {
        test:    /\.ts$/,
        loaders: [
          '@angularclass/hmr-loader',
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader?loader=system&genDir=src/compiled/src/app&aot=' + AOT
        ],
        exclude: [/\.(spec|e2e|d)\.ts$/]
      },
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.html/, loader: 'raw-loader', exclude: [root('src/index.html')]},
      {test: /\.css$/, loaders: ['raw-loader', 'postcss-loader']},
      {test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader']},
      ...MY_CLIENT_RULES
    ]
  };

  config.plugins = [
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src')
    ),
    new ProgressPlugin(),
    new ForkCheckerPlugin(),
    new DefinePlugin(CONSTANTS),
    new NamedModulesPlugin(),
    ...MY_CLIENT_PLUGINS
  ];

  if (DEV_SERVER) {
    config.plugins.push(
      new DllReferencePlugin({
        context:  '.',
        manifest: require(`./dll/polyfill-manifest.json`)
      }),
      new DllReferencePlugin({
        context:  '.',
        manifest: require(`./dll/vendor-manifest.json`)
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject:   false
      })
    );
  }

  if (DLL) {
    config.plugins.push(
      new DllPlugin({
        name: '[name]',
        path: root('dll/[name]-manifest.json'),
      })
    );
  } else {
    config.plugins.push(
      new CopyWebpackPlugin(COPY_FOLDERS, {ignore: ['*dist_root/*']}),
      new CopyWebpackPlugin([{from: 'src/assets/dist_root'}])
    );
  }

  if (PROD) {
    config.plugins.push(
      new NoEmitOnErrorsPlugin(),
      new UglifyJsPlugin({
        beautify: false,
        comments: false
      }),
      new CompressionPlugin({
        asset:     '[path].gz[query]',
        algorithm: 'gzip',
        test:      /\.js$|\.html$/,
        threshold: 10240,
        minRatio:  0.8
      }),
      ...MY_CLIENT_PRODUCTION_PLUGINS
    );
  }

  config.cache = true;
  PROD ? config.devtool = PROD_SOURCE_MAPS : config.devtool = DEV_SOURCE_MAPS;

  if (DLL) {
    config.entry = {
      app_assets: ['./src/main.browser'],
      polyfill:   [
        'sockjs-client',
        '@angularclass/hmr',
        'ts-helpers',
        'zone.js',
        'core-js/client/shim.js',
        'core-js/es6/reflect.js',
        'core-js/es7/reflect.js',
        'querystring-es3',
        'strip-ansi',
        'url',
        'punycode',
        'events',
        'webpack-dev-server/client/socket.js',
        'webpack/hot/emitter.js',
        'zone.js/dist/long-stack-trace-zone.js'
      ],
      vendor:     [...DLL_VENDORS]
    };
  } else {
    if (AOT) {
      config.entry = {
        main: './src/main.browser.aot'
      };
    } else {
      config.entry = {
        main: './src/main.browser'
      };
    }
  }

  if (!DLL) {
    config.output = {
      path:     root('dist/client'),
      filename: 'index.js'
    };
  } else {
    config.output = {
      path:     root('dll'),
      filename: '[name].dll.js',
      library:  '[name]'
    };
  }

  config.devServer = {
    contentBase:        AOT ? './src/compiled' : './src',
    port:               CONSTANTS.PORT,
    historyApiFallback: true,
    host:               '0.0.0.0',
    watchOptions:       DEV_SERVER_WATCH_OPTIONS
  };

  if (USE_DEV_SERVER_PROXY) {
    Object.assign(config.devServer, {
      proxy: DEV_SERVER_PROXY_CONFIG
    });
  }

  config.node = {
    global:         true,
    process:        true,
    Buffer:         false,
    crypto:         true,
    module:         false,
    clearImmediate: false,
    setImmediate:   false,
    clearTimeout:   true,
    setTimeout:     true
  };

  config.resolve = {
    extensions: ['.ts', '.js', '.json']
  };

  return config;
}();

DLL ? console.log('BUILDING DLLs') : console.log('BUILDING APP');
module.exports = clientConfig;
