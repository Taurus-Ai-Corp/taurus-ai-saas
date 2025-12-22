/**
 * Session Command
 * Manage chat sessions
 */

import chalk from 'chalk';
import ora from 'ora';
import { ApiClient } from '../lib/api-client.js';
import { printError, printInfo, printSuccess, formatTimestamp } from '../lib/display.js';

interface SessionOptions {
  id?: string;
  api?: string;
}

export async function sessionCommand(
  action: string = 'list',
  options: SessionOptions
): Promise<void> {
  const apiUrl = options.api || process.env.TAURUS_API_URL || 'http://localhost:3001';
  const client = new ApiClient(apiUrl);

  // Check connection
  const healthy = await client.healthCheck();
  if (!healthy) {
    printError(`Cannot connect to API server at ${apiUrl}`);
    process.exit(1);
  }

  switch (action) {
    case 'list':
    case 'ls':
      await listSessions(client);
      break;

    case 'show':
    case 'get':
      if (!options.id) {
        printError('Session ID required. Use --id <session-id>');
        process.exit(1);
      }
      await showSession(client, options.id);
      break;

    case 'delete':
    case 'rm':
      if (!options.id) {
        printError('Session ID required. Use --id <session-id>');
        process.exit(1);
      }
      await deleteSession(client, options.id);
      break;

    case 'new':
    case 'create':
      await createSession(client);
      break;

    default:
      printError(`Unknown action: ${action}`);
      printInfo('Valid actions: list, show, delete, new');
      process.exit(1);
  }
}

async function listSessions(client: ApiClient): Promise<void> {
  const spinner = ora('Loading sessions...').start();

  try {
    const sessions = await client.listSessions();
    spinner.stop();

    if (sessions.length === 0) {
      printInfo('No sessions found. Start a chat with: taurus chat');
      return;
    }

    console.log(chalk.bold(`\n  Sessions (${sessions.length})\n`));
    console.log(chalk.dim('  ID        Title                          Updated'));
    console.log(chalk.dim('  ─────────────────────────────────────────────────────────'));

    for (const session of sessions) {
      const id = chalk.cyan(session.id.slice(0, 8));
      const title = (session.title || 'Untitled').slice(0, 28).padEnd(30);
      const time = chalk.dim(formatTimestamp(session.time.updated));
      console.log(`  ${id}  ${title}${time}`);
    }

    console.log();
    printInfo('Resume a session with: taurus chat --session <id>');
  } catch (error) {
    spinner.fail('Failed to list sessions');
    printError(error instanceof Error ? error.message : 'Unknown error');
  }
}

async function showSession(client: ApiClient, id: string): Promise<void> {
  const spinner = ora('Loading session...').start();

  try {
    // Find session by partial ID
    const sessions = await client.listSessions();
    const session = sessions.find(s => s.id.startsWith(id));

    if (!session) {
      spinner.fail('Session not found');
      return;
    }

    const messages = await client.getMessages(session.id);
    spinner.stop();

    console.log(chalk.bold(`\n  Session: ${session.title || 'Untitled'}`));
    console.log(chalk.dim(`  ID: ${session.id}`));
    console.log(chalk.dim(`  Created: ${formatTimestamp(session.time.created)}`));
    console.log(chalk.dim(`  Updated: ${formatTimestamp(session.time.updated)}`));
    console.log(chalk.dim(`  Messages: ${messages.length}`));
    console.log();

    if (messages.length > 0) {
      console.log(chalk.bold('  Conversation:'));
      console.log(chalk.dim('  ─────────────────────────────────────────'));

      for (const msg of messages) {
        const text = msg.parts.map(p => p.text).join('');
        const role = msg.info.role === 'user'
          ? chalk.blue.bold('  You: ')
          : chalk.green.bold('  AI:  ');

        // Truncate long messages
        const displayText = text.length > 200
          ? text.slice(0, 200) + '...'
          : text;

        console.log(role + displayText);
      }
      console.log();
    }

    printInfo(`Resume with: taurus chat --session ${session.id.slice(0, 8)}`);
  } catch (error) {
    spinner.fail('Failed to load session');
    printError(error instanceof Error ? error.message : 'Unknown error');
  }
}

async function deleteSession(client: ApiClient, id: string): Promise<void> {
  const spinner = ora('Deleting session...').start();

  try {
    // Find session by partial ID
    const sessions = await client.listSessions();
    const session = sessions.find(s => s.id.startsWith(id));

    if (!session) {
      spinner.fail('Session not found');
      return;
    }

    await client.deleteSession(session.id);
    spinner.stop();
    printSuccess(`Deleted session: ${session.title || session.id.slice(0, 8)}`);
  } catch (error) {
    spinner.fail('Failed to delete session');
    printError(error instanceof Error ? error.message : 'Unknown error');
  }
}

async function createSession(client: ApiClient): Promise<void> {
  const spinner = ora('Creating session...').start();

  try {
    const session = await client.createSession('CLI Session');
    spinner.stop();
    printSuccess(`Created session: ${session.id.slice(0, 8)}`);
    printInfo(`Start chatting with: taurus chat --session ${session.id.slice(0, 8)}`);
  } catch (error) {
    spinner.fail('Failed to create session');
    printError(error instanceof Error ? error.message : 'Unknown error');
  }
}
