import { getRevInfo, parseRevDetails } from './parser';
import { clear, render, show } from './ui';
import { Commit, Rev } from './model';

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
      return await render(values[1], values[0]);
    })
    .catch((e) => {
      console.error(e);
      show('<div style="color: red">获取历史修改失败，请刷新页面后重试</div>');
    });
}

const _cache: Record<string, Commit> = {};

async function fetchRev(rev: Rev | undefined): Promise<Commit> {
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
