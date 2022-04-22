import './testing-utils';
import { expect } from 'chai';
import { DataService } from '../src/classes';
import { ImportMock } from 'ts-mock-imports';
import * as fetchModule from 'node-fetch';

describe('exercise-7: DataService', () => {
  it('should be a singleton', () => {
    const dsA = DataService.instance;
    const dsB = DataService.instance;
    expect(dsA).to.equal(dsB);
  });
  it('should cache requests', async () => {
    const mockManager = ImportMock.mockOther(fetchModule);
    let timesInvoked = 0;
    mockManager.set((() => {
      return new Promise((resolve) => {
        resolve({
          ok: true,
          text: () => new Promise((res) => {
            timesInvoked += 1;
            res('hello world');
          }),
        });
      });
    }) as any);
    const ds = DataService.instance;
    await ds.wordlist;
    await ds.wordlist;
    expect(timesInvoked).to.equal(1);
    ImportMock.restore();
  });
});
