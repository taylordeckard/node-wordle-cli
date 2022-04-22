import * as inquirerModule from 'inquirer';

/**
 * Wrapping the inquirer module so that it can be mocked for unit testing
 */
export const inquirer = inquirerModule;
