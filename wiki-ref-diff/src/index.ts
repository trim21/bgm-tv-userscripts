import * as $ from 'jquery';
import * as lodash from 'lodash';
import { OutputFormatType } from 'diff2html/lib/types';

import { parseRevEl } from './parser';
import { compare } from './compare';
import { configKey } from './config';

type Pos = 'rev-left' | 'rev-right';

async function main(): Promise<void> {
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

async function initUI(): Promise<void> {
  GM.registerMenuCommand('切换diff视图', function () {
    void (async () => {
      let outputFormat = (await GM.getValue(configKey)) as
        | OutputFormatType
        | undefined;
      if (!outputFormat || outputFormat === 'side-by-side') {
        outputFormat = 'line-by-line';
      } else {
        outputFormat = 'side-by-side';
      }
      await GM.setValue(configKey, outputFormat);
    })();
  });

  $('#headerSubject').after(
    '<div id="show-diff-view-side-by-side" class="show-version-diff"></div>',
  );

  $('#columnInSubjectA > hr.board').after(
    style +
      '<div id="show-diff-view-line-by-line" class="show-version-diff"></div>',
  );

  $('#columnInSubjectA .subtitle').after('<div id="show-diff-info"></div>');

  const diff2htmlStyle = await GM.getResourceUrl('diff2html');

  $('head')
    .append(style)
    .append(
      `<link rel='stylesheet' type='text/css' href='${diff2htmlStyle}' />`,
    );

  const s = $('#pagehistory li');

  const revs = Array.from(s).map(function (e) {
    return parseRevEl($(e))?.id;
  });

  s.each(function (index) {
    const el = $(this);
    const id = revs[index];
    if (!id) {
      el.prepend('<span style="padding-right: 1.4em"> 无法参与比较 </span>');
      return;
    }
    el.prepend(
      `<input type='radio' class='rev-trim21-cn' name='rev-right' label='select to compare' value='${id}'>`,
    );
    el.prepend(
      `<input type='radio' class='rev-trim21-cn' name='rev-left' label='select to compare' value='${id}'>`,
    );

    const previous =
      lodash.find<string | undefined>(revs, Boolean, index + 1) ?? '';

    el.prepend(
      `(<a href='#' data-rev='${id}' data-previous='${previous}' class='l compare-previous-trim21-cn'>显示修改</a>) `,
    );
  });

  const typeRevert: Record<Pos, Pos> = {
    'rev-left': 'rev-right',
    'rev-right': 'rev-left',
  };

  $('input[type="radio"]').on('change', function (e) {
    const name = e.target.getAttribute('name') as Pos | undefined;
    if (!name) {
      return;
    }
    const selectName = typeRevert[name];
    const rev = e.target.getAttribute('value');
    if (rev) {
      $(`input[name="${selectName}"][value="${rev}"]`).css(
        'visibility',
        'hidden',
      );

      $(`input[name="${selectName}"][value!="${rev}"]`).css(
        'visibility',
        'visible',
      );
    }
  });

  $('.compare-previous-trim21-cn').on('click', function () {
    const el = $(this);

    const left = String(el.data('rev'));
    const right = String(el.data('previous'));
    compare(left, right);

    $(`input[name="rev-left"][value="${left}"]`).prop('checked', true);

    $(`input[name="rev-left"][value!="${left}"]`).prop('checked', null);

    $(`input[name="rev-right"][value="${left}"]`).css('visibility', 'hidden');

    $(`input[name="rev-right"][value!="${left}"]`).css('visibility', 'visible');

    $('input[name="rev-left"]').css('visibility', 'visible');
    $('input[name="rev-right"]').prop('checked', null);

    if (right) {
      $(`input[name="rev-right"][value="${right}"]`).prop('checked', true);

      $(`input[name="rev-left"][value="${right}"]`).css('visibility', 'hidden');
    }
  });

  $('#columnInSubjectA span.text').append(
    '<a href="#" id="compare-trim21-cn" class="l"> > 比较选中的版本</a>',
  );
  $('#compare-trim21-cn').on('click', function () {
    const selectedRevs = getSelectedVersion();
    compare(selectedRevs[0], selectedRevs[1]);
  });
}

function getSelectedVersion(): string[] {
  const selectedVersion: string[] = [];
  const selectedRev = $('.rev-trim21-cn:checked');
  if (selectedRev.length < 2) {
    window.alert('请选中两个版本进行比较');
    throw new Error();
  }
  selectedRev.each(function () {
    const val = $(this).val() as string;
    selectedVersion.push(val);
  });
  selectedVersion.sort((a, b) => parseInt(b) - parseInt(a));
  return selectedVersion;
}

main().catch(console.error);
