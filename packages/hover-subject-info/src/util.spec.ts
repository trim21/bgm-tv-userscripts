import { describe, expect, test } from '@jest/globals';

import { getSubjectID } from './utils';

describe('should be subject url', () => {
  for (const url of ['/subject/123', '/subject/123?a=q', 'https://bgm.tv/subject/123']) {
    test(`${url}`, () => {
      expect(getSubjectID(url)).toBe(123);
    });
  }
});

describe('should not be subject url', () => {
  for (const url of ['/rakuen/topic/group/373494']) {
    test(`${url}`, () => {
      expect(getSubjectID(url)).toBe(undefined);
    });
  }
});
