import * as Diff2Html from 'diff2html';
import * as $ from 'jquery';
import type { OutputFormatType } from 'diff2html/lib/types';

import { configKey } from './config';
import type { Commit } from './model';
import { diff } from './differ';

export async function render(revOld: Commit, revNew: Commit): Promise<void> {
  let outputFormat = (await GM.getValue(configKey)) as OutputFormatType | undefined;
  if (!outputFormat) {
    outputFormat = 'line-by-line';
  }

  const patch = diff(revOld, revNew, outputFormat);

  const html = Diff2Html.html(patch, { outputFormat });
  const elID = `show-diff-view-${outputFormat}`;

  show('');
  $(`#${elID}`).html(html);
  applyThemeBasedOnCookie();

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

function getCookie(name: string): string | undefined {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

function applyThemeBasedOnCookie(): void {
  const wrapper = $('.d2h-wrapper');

  wrapper.removeClass('d2h-dark-color-scheme d2h-light-color-scheme');

  const theme = getCookie('chii_theme');
  if (theme === 'dark') {
      wrapper.addClass('d2h-dark-color-scheme');
  } else {
      wrapper.addClass('d2h-light-color-scheme');
  }
}
