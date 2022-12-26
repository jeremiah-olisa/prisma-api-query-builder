import { ApiQueryBuilder } from './query-builder';

describe('ApiQueryBuilder', () => {
  it('should be defined', () => {
    expect(new ApiQueryBuilder(null, null, null)).toBeDefined();
  });
});
