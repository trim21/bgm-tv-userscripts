import * as $ from 'jquery';

import { Rev, RevDetail } from './model';

export function parseRevDetails(html: string): RevDetail {
  const jq = $(html);
  const rawInfo = jq.find('#subject_infobox').val()?.toString() ?? '';
  const title = jq.find('input[name="subject_title"]').val()?.toString() ?? '';
  const description =
    jq.find('textarea#subject_summary').val()?.toString() ?? '';
  return {
    title,
    rawInfo,
    description,
  };
}

export function parseRevEl(el: JQuery): Rev | undefined {
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
    url: revHref,
  };
}

function getRevs(): Rev[] {
  const revs: Rev[] = [];
  $('#pagehistory li').each(function () {
    const rev = parseRevEl($(this));
    if (rev != null) {
      revs.push(rev);
    }
  });
  return revs;
}

export function getRevInfo(revID: string): Rev | undefined {
  for (const rev of getRevs()) {
    if (rev.id === revID) {
      return rev;
    }
  }
}
