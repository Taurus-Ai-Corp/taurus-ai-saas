/**
 * Chat Command
 * Interactive AI conversation in the terminal
 */

import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline';
import { ApiClient } from '../lib/api-client.js';
import { printUser, printAssistant, printError, printInfo, printSuccess } from '../lib/display.js';

interface ChatOptions {
  session?: string;
  model?: string;
  api?: string;
}

export async function chatCommand(options: ChatOptions): Promise<void> {
  const apiUrl = options.api || process.env.TAURUS_API_URL || 'http://localhost:3001';
  const client = new ApiClient(apiUrl);

  // Check API health
  const spinner = ora('Connecting to Taurus AI...').start();

  const healthy = await client.healthCheck();
  if (!healthy) {
    spinner.fail('Cannot connect to API server');
    printError(`Make sure the API server is running at ${apiUrl}`);
    printInfo('Start the API with: cd packages/api && npm run dev');
    process.exit(1);
  }
  spinner.succeed('Connected to Taurus AI');

  // Get or create session
  let sessionId = options.session;

  if (sessionId) {
    try {
      const session = await client.getSession(sessionId);
      sessionId = session.id; // Use full ID for subsequent calls
      printInfo(`Resuming session: ${session.title || 'Untitled'}`);

      // Show recent messages
      const messages = await client.getMessages(sessionId);
      if (messages.length > 0) {
        console.log(chalk.dim('\n--- Previous messages ---'));
        for (const msg of messages.slice(-4)) { // Show last 4 messages
          const text = msg.parts.map(p => p.text).join('');
          if (msg.info.role === 'user') {
            console.log(chalk.blue(`You: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`));
          } else {
            console.log(chalk.green(`Taurus: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`));
          }
        }
        console.log(chalk.dim('--- End of history ---\n'));
      }
    } catch {
      printError('Session not found, creating new session');
      sessionId = undefined;
    }
  }

  if (!sessionId) {
    const session = await client.createSession('CLI Chat');
    sessionId = session.id;
    printSuccess(`New session created: ${sessionId.slice(0, 8)}`);
  }

  // Interactive chat loop
  console.log();
  console.log(chalk.dim('Type your message and press Enter. Commands:'));
  console.log(chalk.dim('  /exit    - Exit chat'));
  console.log(chalk.dim('  /clear   - Clear screen'));
  console.log(chalk.dim('  /history - Show message history'));
  console.log(chalk.dim('  /new     - Start new session'));
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.blue('> '),
  });

  rl.prompt();

  rl.on('line', async (input: string) => {
    const trimmed = input.trim();

    if (!trimmed) {
      rl.prompt();
      return;
    }

    // Handle commands
    if (trimmed.startsWith('/')) {
      const command = trimmed.toLowerCase();

      if (command === '/exit' || command === '/quit') {
        console.log(chalk.dim('\nGoodbye! Session saved.'));
        rl.close();
        process.exit(0);
      }

      if (command === '/clear') {
        console.clear();
        rl.prompt();
        return;
      }

      if (command === '/history') {
        const messages = await client.getMessages(sessionId!);
        console.log(chalk.dim(`\n--- ${messages.length} messages ---`));
        for (const msg of messages) {
          const text = msg.parts.map(p => p.text).join('');
          if (msg.info.role === 'user') {
            printUser(text);
          } else {
            printAssistant(text);
          }
        }
        console.log(chalk.dim('--- End ---\n'));
        rl.prompt();
        return;
      }

      if (command === '/new') {
        const session = await client.createSession('CLI Chat');
        sessionId = session.id;
        printSuccess(`New session: ${sessionId.slice(0, 8)}`);
        rl.prompt();
        return;
      }

      printError(`Unknown command: ${command}`);
      rl.prompt();
      return;
    }

    // Send message
    printUser(trimmed);
    const thinkingSpinner = ora({
      text: chalk.dim('Thinking...'),
      spinner: 'dots',
    }).start();

    try {
      const response = await client.sendPrompt(sessionId!, trimmed, {
        model: options.model,
      });

      thinkingSpinner.stop();

      const assistantText = response.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && !!p.text)
        .map(p => p.text)
        .join('');

      printAssistant(assistantText);
    } catch (error) {
      thinkingSpinner.stop();
      printError(error instanceof Error ? error.message : 'Failed to get response');
    }

    console.log();
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.dim('\nSession ended.'));
    process.exit(0);
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log(chalk.dim('\n\nSession saved. Goodbye!'));
    process.exit(0);
  });
}
