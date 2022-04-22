import './testing-utils';
import { Colorizer } from '../src/classes';
import { expect } from 'chai';

describe('exercise-2: Colorizer', () => {
  it('should colorize green', () => {
    expect(Colorizer.green('hello')).to.be
      .equal('\x1B[42m\x1B[30mhello\x1B[39m\x1B[49m');
  });
  it('should colorize yellow', () => {
    expect(Colorizer.yellow('hello')).to.be
      .equal('\x1B[43m\x1B[30mhello\x1B[39m\x1B[49m');
  });
});
