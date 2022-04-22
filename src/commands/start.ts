import { Command } from '../types';
import { Game } from '../classes';

export const StartCommand: Command = {
  name: 'start',
  description: 'Starts the game',
  action: () => (new Game()).start(),
};
