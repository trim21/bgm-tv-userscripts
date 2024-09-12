// ==UserScript==
// @name                bgm-wiki-rev-diff
// @name:zh             bangumi 显示 条目 wiki 版本差异
// @name:zh-CN          bangumi 显示 条目 wiki 版本差异
// @description         显示条目信息版本差异, 可以在 https://github.com/trim21/bgm-tv-userscripts/tree/master/scripts/wiki-rev-diff#readme 查看效果图
// @description:zh-CN   显示条目信息版本差异, 可以在 https://github.com/trim21/bgm-tv-userscripts/tree/master/scripts/wiki-rev-diff#readme 查看效果图
// @namespace           https://trim21.me/
// @version             0.2.24
// @source              https://github.com/trim21/bgm-tv-userscripts
// @supportURL          https://github.com/trim21/bgm-tv-userscripts/issues
// @license             MIT
// @match               https://bgm.tv/subject/*/edit*
// @match               https://bangumi.tv/subject/*/edit*
// @match               https://chii.in/subject/*/edit*
// @require             https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require             https://cdn.jsdelivr.net/npm/diff2html@3.4.48/bundles/js/diff2html.min.js
// @require             https://cdn.jsdelivr.net/npm/diff@7.0.0/dist/diff.min.js
// @require             https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @resource            diff2html https://cdn.jsdelivr.net/npm/diff2html@3.4.48/bundles/css/diff2html.min.css
// @grant               GM.getResourceUrl
// @grant               GM.registerMenuCommand
// @grant               GM.setValue
// @grant               GM.getValue
// @run-at              document-end
// @author              Trim21 <i@trim21.me>
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: external "$"
const external_$_namespaceObject = $;
;// CONCATENATED MODULE: external "_"
const external_namespaceObject = _;
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/parser.ts

function parseRevDetails(html) {
  const jq = external_$_namespaceObject(html);
  const rawInfo = jq.find('#subject_infobox').val()?.toString() ?? '';
  const title = jq.find('input[name="subject_title"]').val()?.toString() ?? '';
  const description = jq.find('textarea#subject_summary').val()?.toString() ?? '';
  return {
    title,
    rawInfo,
    description
  };
}
function parseRevEl(el) {
  const date = el.find('a:not(.compare-previous-trim21-cn)').first().html();
  const revEL = el.find('a.l:contains("恢复")');
  const revCommentEl = el.find('span.comment');
  let comment = '';
  if (revCommentEl.length > 0) {
    comment = revCommentEl.html();
    comment = comment.substring(1, comment.length - 1);
  }
  const revHref = revEL.attr('href');
  if (!revHref) {
    // this is a merge commit, can't know what's really info
    return undefined;
  }
  const revID = revHref.split('/').pop();
  if (!revID) {
    throw new Error(`can't parse rev id from ${revHref}`);
  }
  return {
    id: revID,
    comment,
    date,
    url: revHref
  };
}
function getRevs() {
  const revs = [];
  external_$_namespaceObject('#pagehistory li').each(function () {
    const rev = parseRevEl(external_$_namespaceObject(this));
    if (rev != null) {
      revs.push(rev);
    }
  });
  return revs;
}
function getRevInfo(revID) {
  for (const rev of getRevs()) {
    if (rev.id === revID) {
      return rev;
    }
  }
}
;// CONCATENATED MODULE: external "Diff2Html"
const external_Diff2Html_namespaceObject = Diff2Html;
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/config.ts
const configKey = 'view-mode';
;// CONCATENATED MODULE: external "Diff"
const external_Diff_namespaceObject = Diff;
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/differ.ts

const pattern = /(?![\t\r\n])(\p{Cf}|\p{Cc})/u;
function escapeInvisible(s) {
  return s.replace(pattern, function (match) {
    const u = match.codePointAt(0);
    if (u === undefined) {
      return '';
    }
    return '\\U' + u.toString(16).toUpperCase();
  });
}
function diff(revOld, revNew, style) {
  const options = {
    context: 100
  };
  if (style === 'line-by-line') {
    options.context = 4;
  }
  return [titleDiff(revOld, revNew, options), infoDiff(revOld, revNew, options), descriptionDiff(revOld, revNew, options)].join('\n');
}
function titleDiff(rev1, rev2, options) {
  if (rev1.details.title === rev2.details.title) {
    return '';
  }
  return external_Diff_namespaceObject.createPatch('条目名', escapeInvisible(rev1.details.title), escapeInvisible(rev2.details.title), rev1.rev.date, rev2.rev.date, options);
}
function infoDiff(rev1, rev2, options) {
  if (rev1.details.rawInfo === rev2.details.rawInfo) {
    return '';
  }
  return external_Diff_namespaceObject.createPatch('相关信息', escapeInvisible(rev1.details.rawInfo), escapeInvisible(rev2.details.rawInfo), rev1.rev.date, rev2.rev.date, options);
}
function descriptionDiff(rev1, rev2, options) {
  if (rev1.details.description === rev2.details.description) {
    return '';
  }
  return external_Diff_namespaceObject.createPatch('简介', escapeInvisible(rev1.details.description), escapeInvisible(rev2.details.description), rev1.rev.date, rev2.rev.date, options);
}
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/utils.ts
function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/ui.ts





async function render(revOld, revNew) {
  let outputFormat = await GM.getValue(configKey);
  if (!outputFormat) {
    outputFormat = 'line-by-line';
  }
  const colorScheme = getCookie('chii_theme');
  const patch = diff(revOld, revNew, outputFormat);
  const html = external_Diff2Html_namespaceObject.html(patch, {
    outputFormat,
    colorScheme
  });
  const elID = `show-diff-view-${outputFormat}`;
  show('');
  external_$_namespaceObject(`#${elID}`).html(html);
  document.getElementById(elID)?.scrollIntoView({
    behavior: 'smooth'
  });
}
function show(html) {
  external_$_namespaceObject('#show-diff-info').html(html);
}
function clear() {
  external_$_namespaceObject('#show-diff-view-line-by-line').html('');
  external_$_namespaceObject('#show-diff-view-side-by-side').html('');
  show('');
}
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/model.ts
class Commit {
  constructor(rev, detail) {
    this.rev = rev;
    this.details = detail;
  }
}
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/compare.ts



function compare(revID1, revID2) {
  clear();
  show('<h2>loading versions...</h2>');
  const rev1 = getRevInfo(revID1);
  const rev2 = getRevInfo(revID2);
  if (rev1 == null) {
    throw new Error(`error finding ${revID1}`);
  }
  const ps = [fetchRev(rev1), fetchRev(rev2)];
  Promise.all(ps).then(async values => {
    await render(values[1], values[0]);
  }).catch(e => {
    console.error(e);
    show('<div style="color: red">获取历史修改失败，请刷新页面后重试</div>');
  });
}
const _cache = {};
async function fetchRev(rev) {
  if (rev == null) {
    return new Commit({
      id: '0',
      comment: '',
      date: '',
      url: ''
    }, {
      title: '',
      rawInfo: '',
      description: ''
    });
  }
  if (!_cache[rev.id]) {
    const res = await fetch(rev.url);
    _cache[rev.id] = new Commit(rev, parseRevDetails(await res.text()));
  }
  return _cache[rev.id];
}
;// CONCATENATED MODULE: ./scripts/wiki-rev-diff/src/index.ts





async function main() {
  console.log('start bgm-wiki-rev-diff UserScript');
  await initUI();
}
const style = `
<style>
#show-diff-view-side-by-side {
  margin:0 auto;
  max-width: 100em;
}

.show-version-diff .d2h-code-line, .show-version-diff .d2h-code-side-line {
  width: calc(100% - 8em);
  padding-right: 0;
}

.show-version-diff .d2h-code-line-ctn {
  width: calc(100% - 8em);
}

#columnInSubjectA .rev-trim21-cn {
  margin: 0 0.2em;
}

ul#pagehistory > li > * {
  vertical-align: middle;
}
</style>
`;
async function initUI() {
  GM.registerMenuCommand('切换diff视图', function () {
    void (async () => {
      let outputFormat = await GM.getValue(configKey);
      if (!outputFormat || outputFormat === 'side-by-side') {
        outputFormat = 'line-by-line';
      } else {
        outputFormat = 'side-by-side';
      }
      await GM.setValue(configKey, outputFormat);
    })();
  });
  external_$_namespaceObject('#headerSubject').after('<div id="show-diff-view-side-by-side" class="show-version-diff"></div>');
  external_$_namespaceObject('#columnInSubjectA > hr.board').after(style + '<div id="show-diff-view-line-by-line" class="show-version-diff"></div>');
  external_$_namespaceObject('#columnInSubjectA .subtitle').after('<div id="show-diff-info"></div>');
  const diff2htmlStyle = await GM.getResourceUrl('diff2html');
  external_$_namespaceObject('head').append(style).append(`<link rel='stylesheet' type='text/css' href='${diff2htmlStyle}' />`);
  const s = external_$_namespaceObject('#pagehistory li');
  const revs = Array.from(s).map(function (e) {
    return parseRevEl(external_$_namespaceObject(e))?.id;
  });
  s.each(function (index) {
    const el = external_$_namespaceObject(this);
    const id = revs[index];
    if (!id) {
      el.prepend('<span style="padding-right: 1.4em"> 无法参与比较 </span>');
      return;
    }
    el.prepend(`<input type='radio' class='rev-trim21-cn' name='rev-right' label='select to compare' value='${id}'>`);
    el.prepend(`<input type='radio' class='rev-trim21-cn' name='rev-left' label='select to compare' value='${id}'>`);
    const previous = external_namespaceObject.find(revs, Boolean, index + 1) ?? '';
    el.prepend(`(<a href='#' data-rev='${id}' data-previous='${previous}' class='l compare-previous-trim21-cn'>显示修改</a>) `);
  });
  const typeRevert = {
    'rev-left': 'rev-right',
    'rev-right': 'rev-left'
  };
  external_$_namespaceObject('input[type="radio"]').on('change', function (e) {
    const name = e.target.getAttribute('name');
    if (!name) {
      return;
    }
    const selectName = typeRevert[name];
    const rev = e.target.getAttribute('value');
    if (rev) {
      external_$_namespaceObject(`input[name="${selectName}"][value="${rev}"]`).css('visibility', 'hidden');
      external_$_namespaceObject(`input[name="${selectName}"][value!="${rev}"]`).css('visibility', 'visible');
    }
  });
  external_$_namespaceObject('.compare-previous-trim21-cn').on('click', function () {
    const el = external_$_namespaceObject(this);
    const left = String(el.data('rev'));
    const right = String(el.data('previous'));
    compare(left, right);
    external_$_namespaceObject(`input[name="rev-left"][value="${left}"]`).prop('checked', true);
    external_$_namespaceObject(`input[name="rev-left"][value!="${left}"]`).prop('checked', null);
    external_$_namespaceObject(`input[name="rev-right"][value="${left}"]`).css('visibility', 'hidden');
    external_$_namespaceObject(`input[name="rev-right"][value!="${left}"]`).css('visibility', 'visible');
    external_$_namespaceObject('input[name="rev-left"]').css('visibility', 'visible');
    external_$_namespaceObject('input[name="rev-right"]').prop('checked', null);
    if (right) {
      external_$_namespaceObject(`input[name="rev-right"][value="${right}"]`).prop('checked', true);
      external_$_namespaceObject(`input[name="rev-left"][value="${right}"]`).css('visibility', 'hidden');
    }
  });
  external_$_namespaceObject('#columnInSubjectA span.text').append('<a href="#" id="compare-trim21-cn" class="l"> > 比较选中的版本</a>');
  external_$_namespaceObject('#compare-trim21-cn').on('click', function () {
    const selectedRevs = getSelectedVersion();
    compare(selectedRevs[0], selectedRevs[1]);
  });
}
function getSelectedVersion() {
  const selectedVersion = [];
  const selectedRev = external_$_namespaceObject('.rev-trim21-cn:checked');
  if (selectedRev.length < 2) {
    window.alert('请选中两个版本进行比较');
    throw new Error();
  }
  selectedRev.each(function () {
    const val = external_$_namespaceObject(this).val();
    selectedVersion.push(val);
  });
  selectedVersion.sort((a, b) => parseInt(b) - parseInt(a));
  return selectedVersion;
}
main().catch(console.error);
/******/ })()
;