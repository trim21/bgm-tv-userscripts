import * as Diff from 'diff';
import type { PatchOptions } from 'diff';
import type { OutputFormatType } from 'diff2html/lib/types';

import type { Commit } from './model';

const pattern = /(?![\t\r\n])(\p{Cf}|\p{Cc}|\p{Co})/gu;

function escapeInvisible(s: string): string {
  return s.replaceAll(pattern, function (match): string {
    const u = match.codePointAt(0);
    if (u === undefined) {
      return '';
    }
    return '\\u' + u.toString(16).toLowerCase();
  });
}

export function diff(revOld: Commit, revNew: Commit, style: OutputFormatType): string {
  const options: PatchOptions = { context: 100 };
  if (style === 'line-by-line') {
    options.context = 4;
  }
  return [
    oneLineDiff('标题', revOld.details.title, revNew.details.title, revOld.rev.date, revNew.rev.date, options),
    oneLineDiff('标签', revOld.details.metaTags, revNew.details.metaTags, revOld.rev.date, revNew.rev.date, options),
    infoDiff(revOld, revNew, options),
    descriptionDiff(revOld, revNew, options),
  ].join('\n');
}

function oneLineDiff(
  name: string,
  s1: string,
  s2: string,
  oldDate: string,
  newDate: string,
  options: PatchOptions,
): string {
  if (s1 === s2) {
    return '';
  }
  return Diff.createPatch(name, escapeInvisible(s1), escapeInvisible(s2), oldDate, newDate, options);
}

function infoDiff(rev1: Commit, rev2: Commit, options: PatchOptions): string {
  if (rev1.details.rawInfo === rev2.details.rawInfo) {
    return '';
  }
  return Diff.createPatch(
    '相关信息',
    escapeInvisible(rev1.details.rawInfo),
    escapeInvisible(rev2.details.rawInfo),
    rev1.rev.date,
    rev2.rev.date,
    options,
  );
}

function descriptionDiff(rev1: Commit, rev2: Commit, options: PatchOptions): string {
  if (rev1.details.description === rev2.details.description) {
    return '';
  }
  return Diff.createPatch(
    '简介',
    escapeInvisible(rev1.details.description),
    escapeInvisible(rev2.details.description),
    rev1.rev.date,
    rev2.rev.date,
    options,
  );
}
