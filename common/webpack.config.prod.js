const path = require('path');

const { mergeWithRules } = require('webpack-merge');
const { UserScriptMetaDataPlugin } = require('userscript-metadata-webpack-plugin');

const webpackConfig = require('./webpack.config.base');
const { author } = require('../package.json');

const merge = mergeWithRules({ plugins: 'append' });

module.exports = function create(entry, metadata, externals = {}) {
  Object.assign(metadata, { author });

  return merge(webpackConfig, {
    cache: {
      type: 'filesystem',
      name: 'prod-' + metadata.name,
    },
    mode: 'production',
    entry: entry,
    output: {
      filename: metadata.name + '.prod.user.js',
      path: path.resolve(__dirname, '../dist/'),
    },
    externals,
    plugins: [new UserScriptMetaDataPlugin({ metadata })],
  });
};
