const create = require('../../../common/webpack.config.prod');
const { externals, metadata, entry } = require('./config.base');

module.exports = create(entry, metadata, externals);
