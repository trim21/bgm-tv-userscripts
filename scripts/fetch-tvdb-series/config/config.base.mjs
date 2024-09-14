import * as path from 'node:path';

import pkg from '../../../package.json' with { type: 'json' };

export const entry = path.join(import.meta.dirname, '../src/index.ts');

export const externals = {
  jquery: '$',
  lodash: '_',
};

export const metadata = {
  name: 'fetch episodes from tvdb',
  'name:zh-CN': '抓取 tvdb 条目',
  namespace: 'https://trim21.me/',
  version: '0.2.27',
  source: pkg.repository.url,
  supportURL: pkg.repository.url + '/issues',
  license: 'MIT',
  match: ['https://bgm.tv/new_subject/*'],
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${pkg.dependencies.jquery}/dist/jquery.min.js`,
    `https://cdn.jsdelivr.net/npm/lodash@${pkg.dependencies.lodash}/lodash.min.js`,
  ],
  grant: ['GM_info'],
  'run-at': 'document-end',
};
