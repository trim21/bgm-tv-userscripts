const create = require('common/webpack.config.dev');

const { externals, metadata, entry } = require('./config.base');

module.exports = create(entry, metadata, externals);
