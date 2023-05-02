const create = require('../../../common/webpack.config.prod');
const { externals, metadata, entry, commonOptions } = require('./config.base');

module.exports = create(entry, metadata, externals, commonOptions);
