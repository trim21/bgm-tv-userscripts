import * as Diff from 'diff';
import { PatchOptions } from 'diff';
import { OutputFormatType } from 'diff2html/lib/types';

import { Commit } from './model';

export function diff(
  revOld: Commit,
  revNew: Commit,
  style: OutputFormatType,
): string {
  const options: PatchOptions = { context: 100 };
  if (style === 'line-by-line') {
    options.context = 4;
  }
  return [
    titleDiff(revOld, revNew, options),
    infoDiff(revOld, revNew, options),
    descriptionDiff(revOld, revNew, options),
  ].join('\n');
}

function titleDiff(rev1: Commit, rev2: Commit, options: PatchOptions): string {
  if (rev1.details.title === rev2.details.title) {
    return '';
  }
  return Diff.createPatch(
    '条目名',
    rev1.details.title,
    rev2.details.title,
    rev1.rev.date,
    rev2.rev.date,
    options,
  );
}

function infoDiff(rev1: Commit, rev2: Commit, options: PatchOptions): string {
  if (rev1.details.rawInfo === rev2.details.rawInfo) {
    return '';
  }
  return Diff.createPatch(
    '相关信息',
    rev1.details.rawInfo,
    rev2.details.rawInfo,
    rev1.rev.date,
    rev2.rev.date,
    options,
  );
}

function descriptionDiff(
  rev1: Commit,
  rev2: Commit,
  options: PatchOptions,
): string {
  if (rev1.details.description === rev2.details.description) {
    return '';
  }
  return Diff.createPatch(
    '简介',
    rev1.details.description,
    rev2.details.description,
    rev1.rev.date,
    rev2.rev.date,
    options,
  );
}
