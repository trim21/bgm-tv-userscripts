import * as $ from 'jquery';

import { getLastRev, getRevInfo, parseRevDetails } from './parser';
import { clear, render, show } from './ui';
import type { Rev } from './model';
import { Commit } from './model';

export function compare(revID1: string, revID2: string): void {
  clear();
  show('<h2>loading versions...</h2>');
  const rev1 = getRevInfo(revID1);
  const rev2 = getRevInfo(revID2);
  if (rev1 == null) {
    throw new Error(`error finding ${revID1}`);
  }
  const ps: Array<Promise<Commit>> = [fetchRev(rev1), fetchRev(rev2)];

  Promise.all(ps)
    .then(async (values) => {
      await render(values[1], values[0]);
    })
    .catch((e) => {
      console.error(e);
      show('<div style="color: red">获取历史修改失败，请刷新页面后重试</div>');
    });
}

export function compareWithLastVersion(): void {
  const normaltoWCODE = document.querySelector('a[onclick="NormaltoWCODE()"]');

  if (normaltoWCODE instanceof HTMLAnchorElement) {
    normaltoWCODE.click();
  }

  clear();
  show('<h2>loading versions...</h2>');

  const subjectUrl = getSubjectUrl();
  const currentRev = createCurrentRevision();

  getLastRev(subjectUrl)
    .then(async (lastRev) => {
      await render(lastRev, currentRev);
    })
    .catch((e) => {
      console.error(e);
      show('<div style="color: red">获取历史修改失败，请刷新页面后重试</div>');
    });
}

function getSubjectUrl(): string {
  return window.location.href.split('/edit_detail').shift() + '/edit';
}

function createCurrentRevision(): Commit {
  return new Commit(
    {
      id: '0',
      comment: '',
      date: '当前修改',
      url: '',
    },
    {
      rawInfo: $('#subject_infobox').val()?.toString() ?? '',
      title: $('input[name="subject_title"]').val()?.toString() ?? '',
      description: $('textarea#subject_summary').val()?.toString() ?? '',
    },
  );
}

const _cache: Record<string, Commit> = {};

export async function fetchRev(rev: Rev | undefined): Promise<Commit> {
  if (rev == null) {
    return new Commit(
      {
        id: '0',
        comment: '',
        date: '',
        url: '',
      },
      {
        title: '',
        rawInfo: '',
        description: '',
      },
    );
  }

  if (!_cache[rev.id]) {
    const res = await fetch(rev.url);
    _cache[rev.id] = new Commit(rev, parseRevDetails(await res.text()));
  }

  return _cache[rev.id];
}
