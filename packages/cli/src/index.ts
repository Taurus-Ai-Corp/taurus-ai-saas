#!/usr/bin/env node
/**
 * Taurus AI CLI
 * Command-line interface for AI-powered chat
 */

import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import { chatCommand } from './commands/chat.js';
import { sessionCommand } from './commands/session.js';
import { configCommand } from './commands/config.js';

const program = new Command();

// ASCII Art Banner
const banner = `
${chalk.cyan('╔════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('TAURUS AI')} ${chalk.gray('- Intelligent Assistant')}   ${chalk.cyan('║')}
${chalk.cyan('╚════════════════════════════════════════╝')}
`;

program
  .name('taurus')
  .description('Taurus AI CLI - Your intelligent coding assistant')
  .version('1.0.0')
  .hook('preAction', () => {
    if (process.argv[2] !== 'config' && !process.argv.includes('--quiet')) {
      console.log(banner);
    }
  });

// Chat command - interactive AI conversation
program
  .command('chat')
  .description('Start an interactive chat session')
  .option('-s, --session <id>', 'Resume existing session')
  .option('-m, --model <model>', 'Model to use (default: claude-sonnet-4-20250514)')
  .option('--api <url>', 'API server URL (default: http://localhost:3001)')
  .action(chatCommand);

// Session management
program
  .command('session')
  .description('Manage chat sessions')
  .argument('[action]', 'Action: list, show, delete', 'list')
  .option('-i, --id <id>', 'Session ID for show/delete')
  .option('--api <url>', 'API server URL')
  .action(sessionCommand);

// Configuration
program
  .command('config')
  .description('Configure CLI settings')
  .argument('[action]', 'Action: show, set, reset', 'show')
  .option('-k, --key <key>', 'Configuration key')
  .option('-v, --value <value>', 'Configuration value')
  .action(configCommand);

// Quick prompt (non-interactive)
program
  .command('ask')
  .description('Send a quick prompt without interactive mode')
  .argument('<prompt>', 'The prompt to send')
  .option('-m, --model <model>', 'Model to use')
  .option('--api <url>', 'API server URL')
  .action(async (prompt: string, options: { model?: string; api?: string }) => {
    const { quickAsk } = await import('./commands/ask.js');
    await quickAsk(prompt, options);
  });

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
