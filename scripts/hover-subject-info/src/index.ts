import * as $ from 'jquery';

import type { Subject } from './model';
import { getSubjectID } from './utils';

const style = `
<style>
.d-block {
  display: block;
}
.d-flex {
  display: flex;
}

#popup {
  width: 30em;
  /*height: 15em;*/
  flex: auto;
  background: white;
  border: solid 1px black;
  position: absolute;
  padding: 0.5em;
  border-radius: 0.2em;
}
.tag .name {
  /*background-color: dodgerblue;*/
  /*color: white;*/
}

.popup-tags{
  display: block;
}

.tag {
  border-radius: 0.2em;
  border: solid 1px gray;
  padding: 0 0.3em;
}

.image {
  padding-right: 2px;
}

</style>
`;

function createPopup(subject: Subject): string {
  let rank = '';
  if (subject.rating.rank) {
    rank = `<p class='rateInfo'>
<span class='starstop-s'><span class='starlight stars${Math.round(subject.rating.score)}'></span></span>
 <small class='fade'>${subject.rating.score}</small> <span class='tip_j'>(${subject.rating.total}人评分)</span>
</p>`;
  }

  let tags = '';
  if (subject.tags.length) {
    tags =
      "<div class='popup-tags'>" +
      subject.tags
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(
          (value) => `<span class='tag'><span class='name'>${value.name}</span> <small>${value.count}</small></span>`,
        )
        .join('\n');
    tags += '</div>';
  }

  return `
<div class='d-flex'>
  <span class='image d-block'>
    <img src='${subject.images?.small}' class='cover' alt='${subject.name}'>
  </span>
  <div class='d-block'>
    <h3>${subject.name}</h3>
    <small class='grey'>${subject.name_cn}</small>
    <p class='info tip'> ${subject.summary} </p>
  </div>
</div>

${rank}

${tags}
`;
}

function main(): void {
  console.log(GM.info.script.name);
  $('head').append(style);

  $('a').each((i, e) => {
    if (getSubjectID($(e).attr('href'))) {
      $(e).on('mouseover', hoverHandler).on('mouseleave', leaveHandler);
    }
  });
}

function leaveHandler(this: HTMLElement): void {
  $('#popup').remove();
  console.log('leave');
}

function hoverHandler(this: HTMLElement): void {
  const e = $(this);
  const href = e.attr('href');
  if (!href) {
    return;
  }

  const offset = e.offset() ?? { left: 0, top: 0 };
  $('body').append('<div id="popup"> loading </div>');

  const popup = $('#popup').css({
    left: offset.left,
    top: offset.top + 40,
    position: 'absolute',
    'z-index': 1000,
  });

  const subjectID = getSubjectID(href);
  if (!subjectID) {
    return;
  }

  (async function () {
    const res = await getWithCache(subjectID);
    if (res.status > 400) {
      popup.html('not found');

      return;
    }
    const data = (await res.json()) as Subject;

    let html = createPopup(data);

    if (res.redirected) {
      html = '条目被合并到此条目' + html;
    }

    popup.html(html);
  })().catch(console.error);
}

interface Item {
  res: Response;
  createdAt: number;
}
const c: Record<number, Item> = {};

async function getWithCache(subjectID: number): Promise<Response> {
  if (subjectID in c) {
    if (c[subjectID].createdAt + 1000 * 60 * 5 > new Date().getTime()) {
      // cache request in 5min
      return c[subjectID].res.clone();
    }
  }

  const res = await fetch(`https://api.bgm.tv/v0/subjects/${subjectID}`);

  c[subjectID] = { res: res.clone(), createdAt: new Date().getTime() };

  return res;
}

main();
