import './testing-utils';
import { expect } from 'chai';
import { Prompter } from '../src/classes';
import * as DataServiceModule from '../src/classes/DataService';
import { ImportMock } from 'ts-mock-imports';
import * as inquirerModule from '../src/utils/Inquirer';

describe('exercise-8: Prompter', () => {
  it('should validate input', async () => {
    const inquirerMock = ImportMock.mockOther(inquirerModule, 'inquirer');
    const dsMock = ImportMock.mockOther(DataServiceModule, 'DataService')
    dsMock.set({
      get instance () {
        return {
          wordlist: ['tests'],
        };
      },
    } as any);
    let validatorFn: Function | undefined;
    inquirerMock.set({
      prompt: (config: any[]) => {
        validatorFn = config[0].validate;
      },
    } as any);

    const prompter = new Prompter();
    await prompter.promptUserGuess(1);
    expect(validatorFn).not.to.be.undefined();
    expect(typeof validatorFn).to.equal('function');
    expect(validatorFn?.('start')).to.equal('Not a valid word');
    expect(validatorFn?.('tests')).to.equal(true);

    ImportMock.restore();
  });
});
