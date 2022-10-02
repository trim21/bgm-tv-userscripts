const { externals, metadata, entry } = require('./config.base');
const create = require('../../config/webpack.config.prod');

module.exports = create(entry, metadata, externals);
