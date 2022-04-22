import './testing-utils';
import { Validator } from '../src/classes';
import { expect } from 'chai';

describe('exercise-1: Validator', () => {
  it('should have imported validator', () => {
    expect(Validator.hasValidator()).to.be.true();
  });

  it('should only allow alphabetic words', () => {
    const expected = 'Input must be letters A-Z';
    expect(Validator.checkGuess(['tests'], '')).to.be.equal(expected);
    expect(Validator.checkGuess(['tests'], 'a1b2!')).to.be.equal(expected);
    expect(Validator.checkGuess(['tests'], 'tests')).to.be.true();
  });

  it('should only allow 5-letter words', () => {
    const expected = 'Input must be exactly 5 letters';
    expect(Validator.checkGuess(['tests'], 'abc')).to.be.equal(expected);
    expect(Validator.checkGuess(['tests'], 'abcedf')).to.be.equal(expected);
    expect(Validator.checkGuess(['tests'], 'tests')).to.be.true();
  });

  it('should only allow words from the acceptable word list', () => {
    const expected = 'Not a valid word';
    expect(Validator.checkGuess(['tests'], 'words')).to.be.equal(expected);
    expect(Validator.checkGuess(['tests'], 'tests')).to.be.true();
  });
});
