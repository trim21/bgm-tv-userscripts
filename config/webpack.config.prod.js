const { mergeWithRules } = require('webpack-merge');
const UserScriptMetaDataPlugin = require('userscript-metadata-webpack-plugin');

const webpackConfig = require('./webpack.config.base');

const merge = mergeWithRules({ plugins: 'append' });

module.exports = function create(entry, metadata, externals = {}) {
  return merge(webpackConfig, {
    cache: {
      type: 'filesystem',
      name: 'prod-' + metadata.name,
    },
    mode: 'production',
    entry: entry,
    output: {
      filename: metadata.name + '.prod.user.js',
    },
    externals,
    plugins: [new UserScriptMetaDataPlugin({ metadata })],
  });
};
