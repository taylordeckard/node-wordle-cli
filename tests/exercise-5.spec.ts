import './testing-utils';
import { expect } from 'chai';
import { Parser } from '../src/classes';

describe('exercise-5: Parser', () => {
  it('should parse a text file of 5 letter words, sorting results', () => {
    const text = '# This is a text file\n\nhello\nworld\ntests';
    expect(Parser.parseWordlistResponse(text).toString()).to.equal([
      'hello',
      'tests',
      'world',
    ].toString());
  });
  it('should parse a text file of 5 letter words without sorting', () => {
    const text = '# This is a text file\n\nhello\nworld\ntests';
    expect(Parser.parseWordlistResponse(text, false).toString()).to.equal([
      'hello',
      'world',
      'tests',
    ].toString());
  });
  it('should extract a javascript filename from html', () => {
    const text = '<html><head><script src="main.a1k13l5.js"></script></head>'
      + '<body></body></html>';
    expect(Parser.parseWordleIndex(text)).to.equal('main.a1k13l5.js');
  });
  it('should extract a list of wordle answers from the wordle js file', () => {
    const text = 'function () { const A = 1;const B = 2;var Ma=["hello","world","tests"];'
      + 'var C = \'something\'; }';
    expect(Parser.parseWordleJavascript(text).toString()).to.equal([
      'hello',
      'world',
      'tests',
    ].toString());
  });
  it('should fail gracefully', () => {
    expect(Parser.parseWordleIndex('')).to.equal('');
    expect(Parser.parseWordleJavascript('')).to.be.empty();
    expect(Parser.parseWordlistResponse('')).to.be.empty();
  });
});
