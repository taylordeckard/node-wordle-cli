import './testing-utils';
import chai, { expect } from 'chai';
import { commands } from '../src/commands';
import { Command } from '../src/types';
import { ImportMock, OtherManager } from 'ts-mock-imports';
import { Solver } from '../src/classes';
import * as DataServiceModule from '../src/classes/DataService';
const { DataService } = DataServiceModule;

let solveCmd: Command | undefined;
let mockManager: OtherManager<typeof DataService>;

describe('exercise-3: Commander', () => {
  beforeEach(() => {
    solveCmd = commands.find(cmd => cmd.name === 'solve');
    mockManager = ImportMock.mockOther(DataServiceModule, 'DataService');
    mockManager.set({
      get instance () {
        return {
          starterWords: ['', '', '', '', 'start'],
          realWordlist: ['start'],
          allWordsOrdered: ['start'],
        };
      },
    } as any);
  });
  it('should have the --debug option', () => {
    const debugOpt = solveCmd?.options?.find((opt) => opt.invocation.includes('--debug'));
    expect(debugOpt).not.to.be.undefined();
  });
  it('should pass debug option to action', async () => {
    let loggedStr = '';
    chai.spy.on(console, 'log', (str: string) => {
      if (!loggedStr) {
        loggedStr = str;
      }
    });
    await (new Solver()).solve({ debug: true, hard: false, iterations: 1 } as any);
    expect(loggedStr).to.be
      .equal('\x1B[42m\x1B[30ms\x1B[39m\x1B[49m\x1B[42m\x1B[30mt\x1B'
        + '[39m\x1B[49m\x1B[42m\x1B[30ma\x1B[39m\x1B[49m\x1B[42m\x1B[30mr\x1B'
        + '[39m\x1B[49m\x1B[42m\x1B[30mt\x1B[39m\x1B[49m');
  });
  afterEach(() => {
    ImportMock.restore();
  });
});
