export interface RevDetail {
  title: string;
  rawInfo: string;
  description: string;
}

export interface Rev {
  id: string;
  comment: string;
  date: string;
  url: string;
}

export class Commit {
  rev: Rev;
  details: RevDetail;

  constructor(rev: Rev, detail: RevDetail) {
    this.rev = rev;
    this.details = detail;
  }
}
