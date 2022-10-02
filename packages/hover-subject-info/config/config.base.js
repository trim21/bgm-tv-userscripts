const path = require('path');

const { version } = require('../package.json');
const { repository, dependencies } = require('../../../package.json');

const match = [];

for (const m of ['/group/topic/*', '/index/*', '/rakuen/topiclist']) {
  match.push(...['bgm.tv', 'bangumi.tv', 'chii.in'].map((x) => `https://${x}${m}`));
}

module.exports = {
  entry: path.join(__dirname, '../src/index.ts'),

  metadata: {
    name: 'bgm-hover-subject-info',
    'name:zh': '鼠标指向条目链接时显示更多信息',
    namespace: 'https://trim21.me/',
    description: '鼠标指向条目链接时弹出一个悬浮窗显示条目信息',
    version,
    source: repository.url,
    supportURL: repository.url + '/issues',
    license: 'MIT',
    match,
    require: [`https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`],
    'run-at': 'document-end',
  },

  externals: {
    jquery: '$',
    diff2html: 'Diff2Html',
    diff: 'Diff',
    lodash: '_',
  },
};
