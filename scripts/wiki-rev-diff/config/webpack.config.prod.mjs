import { createRequire } from 'node:module';

import { externals, metadata, entry } from './config.base.mjs';

const require = createRequire(import.meta.url);

const create = require('../../../common/webpack.config.prod');

export default create(entry, metadata, externals);
