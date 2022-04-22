import './testing-utils';
import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import * as fetchModule from 'node-fetch';
import { API } from '../src/classes';

describe('exercise-4: API', () => {
  beforeEach(() => {
    const mockManager = ImportMock.mockOther(fetchModule);
    mockManager.set((() => {
      return new Promise((resolve) => {
        resolve({
          ok: true,
          text: () => new Promise((res) => {
            res('hello world');
          }),
        });
      });
    }) as any);
  });
  it('should make a http request', () => {
    return expect(API.fetchWordleIndex()).to.eventually.equal('hello world')
  });
  afterEach(() => {
    ImportMock.restore();
  })
});
