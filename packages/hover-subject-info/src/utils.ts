export function getSubjectID(s: string | undefined): number | undefined {
  if (!s?.length) return undefined;

  if (s.startsWith('/')) {
    s = 'https://bgm.tv' + s;
  }

  const u = new URL(s);
  const path = u.pathname;

  // [ '', 'subject', '8' ]
  const split = path.split('/');
  if (split.length >= 4) {
    return undefined;
  }

  if (split[1] === 'subject') {
    return parseInt(split[2], 10);
  }

  return undefined;
}
