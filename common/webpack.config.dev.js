const path = require('path');

const { mergeWithRules } = require('webpack-merge');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const { UserScriptMetaDataPlugin } = require('userscript-metadata-webpack-plugin');

const webpackConfig = require('./webpack.config.base');
const { author } = require('../package.json');

const merge = mergeWithRules({ plugins: 'append' });

module.exports = function create(entry, metadata, externals = {}, options = {}) {
  metadata = JSON.parse(JSON.stringify(metadata));

  Object.assign(metadata, { author });

  metadata.require.push('file://' + path.resolve(__dirname, `../dist/dev/${metadata.name}.debug.js`));

  return merge(
    webpackConfig,
    {
      cache: {
        type: 'filesystem',
        name: 'dev-' + metadata.name,
      },
      mode: 'development',
      entry: {
        debug: entry,
        'dev.user': path.resolve(__dirname, './empty.js'),
      },
      output: {
        filename: `${metadata.name}.[name].js`,
        path: path.resolve(__dirname, '../dist/dev'),
      },
      devtool: 'eval',
      watch: true,
      watchOptions: {
        ignored: /node_modules/,
      },
      externals,
      plugins: [new LiveReloadPlugin({ delay: 500 }), new UserScriptMetaDataPlugin({ metadata })],
    },
    options,
  );
};
