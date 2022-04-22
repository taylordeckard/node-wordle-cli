import './testing-utils';
import chai, { expect } from 'chai';
import { getAnswerIndex } from '../src/utils';

describe('exercise-6: Utils', () => {
  beforeEach(() => {
    chai.spy.on(Date, 'now', () => 1649777258624);
  });
  it('should get the index of today\'s wordle', () => {
    expect(getAnswerIndex()).to.equal(297);
  });
  afterEach(() => {
    chai.spy.restore(Date, 'now');
  });
});
