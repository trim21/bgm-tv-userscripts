const path = require('path');

const { dependencies, description } = require('../../../package.json');
const { repository, author } = require('../../../package.json');

module.exports = {
  commonOptions: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: 'raw-loader',
        },
      ],
    },
  },

  entry: path.join(__dirname, '../src/index.ts'),
  externals: {
    jquery: '$',
  },
  metadata: {
    name: 'bangumi-sort-index',
    'name:zh': '排序首页条目',
    namespace: 'https://trim21.me/',
    description,
    version: '0.0.10',
    author,
    source: repository.url,
    supportURL: repository.url + '/issues',
    license: 'MIT',
    include: String.raw`/^https://(bangumi\.tv|bgm\.tv|chii\.in)/[^/]*/`,
    require: [`https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`],
    'run-at': 'document-end',
  },
};
