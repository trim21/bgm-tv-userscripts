import * as Diff2Html from 'diff2html';
import * as $ from 'jquery';
import type { ColorSchemeType, OutputFormatType } from 'diff2html/lib/types';

import { configKey } from './config';
import type { Commit } from './model';
import { diff } from './differ';
import { getCookie } from './utils';

export async function render(revOld: Commit, revNew: Commit): Promise<void> {
  let outputFormat = (await GM.getValue(configKey)) as OutputFormatType | undefined;
  if (!outputFormat) {
    outputFormat = 'line-by-line';
  }
  const colorScheme = getCookie('chii_theme') as ColorSchemeType;

  const patch = diff(revOld, revNew, outputFormat);

  const html = Diff2Html.html(patch, { outputFormat, colorScheme });
  const elID = `show-diff-view-${outputFormat}`;

  show('');
  $(`#${elID}`).html(html);

  document.getElementById(elID)?.scrollIntoView({
    behavior: 'smooth',
  });
}

export function show(html: string): void {
  $('#show-diff-info').html(html);
}

export function clear(): void {
  $('#show-diff-view-line-by-line').html('');
  $('#show-diff-view-side-by-side').html('');
  show('');
}
