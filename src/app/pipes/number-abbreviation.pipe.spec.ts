import { NumberAbbreviationPipe } from './number-abbreviation.pipe';

describe('NumberAbbreviationPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberAbbreviationPipe();
    expect(pipe).toBeTruthy();
  });
});
