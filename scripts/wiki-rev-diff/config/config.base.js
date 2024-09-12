const path = require('path');

const { dependencies, repository } = require('../../../package.json');

module.exports = {
  entry: path.join(__dirname, '../src/index.ts'),
  externals: {
    jquery: '$',
    diff2html: 'Diff2Html',
    diff: 'Diff',
    lodash: '_',
  },
  metadata: {
    name: 'bgm-wiki-rev-diff',
    'name:zh': 'bangumi 显示 条目 wiki 版本差异',
    'name:zh-CN': 'bangumi 显示 条目 wiki 版本差异',
    description:
      '显示条目信息版本差异, 可以在 https://github.com/trim21/bgm-tv-userscripts/tree/master/scripts/wiki-rev-diff#readme 查看效果图',
    'description:zh-CN':
      '显示条目信息版本差异, 可以在 https://github.com/trim21/bgm-tv-userscripts/tree/master/scripts/wiki-rev-diff#readme 查看效果图',
    namespace: 'https://trim21.me/',
    version: '0.2.26',
    source: repository.url,
    supportURL: repository.url + '/issues',
    license: 'MIT',
    match: ['https://bgm.tv/subject/*/edit*', 'https://bangumi.tv/subject/*/edit*', 'https://chii.in/subject/*/edit*'],
    require: [
      `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
      `https://cdn.jsdelivr.net/npm/diff2html@${dependencies.diff2html}/bundles/js/diff2html.min.js`,
      `https://cdn.jsdelivr.net/npm/diff@${dependencies.diff}/dist/diff.min.js`,
      `https://cdn.jsdelivr.net/npm/lodash@${dependencies.lodash}/lodash.min.js`,
    ],
    resource: {
      diff2html: `https://cdn.jsdelivr.net/npm/diff2html@${dependencies.diff2html}/bundles/css/diff2html.min.css`,
    },
    grant: ['GM.getResourceUrl', 'GM.registerMenuCommand', 'GM.setValue', 'GM.getValue'],
    'run-at': 'document-end',
  },
};
