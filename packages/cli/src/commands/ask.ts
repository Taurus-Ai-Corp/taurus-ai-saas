/**
 * Ask Command
 * Quick non-interactive prompt
 */

import chalk from 'chalk';
import ora from 'ora';
import { ApiClient } from '../lib/api-client.js';
import { printError, printAssistant } from '../lib/display.js';

interface AskOptions {
  model?: string;
  api?: string;
}

export async function quickAsk(prompt: string, options: AskOptions): Promise<void> {
  const apiUrl = options.api || process.env.TAURUS_API_URL || 'http://localhost:3001';
  const client = new ApiClient(apiUrl);

  // Check connection
  const healthy = await client.healthCheck();
  if (!healthy) {
    printError(`Cannot connect to API server at ${apiUrl}`);
    process.exit(1);
  }

  const spinner = ora({
    text: chalk.dim('Thinking...'),
    spinner: 'dots',
  }).start();

  try {
    // Create a temporary session
    const session = await client.createSession('Quick Ask');

    // Send prompt
    const response = await client.sendPrompt(session.id, prompt, {
      model: options.model,
    });

    spinner.stop();

    // Extract and display response
    const assistantText = response.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && !!p.text)
      .map(p => p.text)
      .join('');

    printAssistant(assistantText);

    // Clean up - delete the temporary session
    await client.deleteSession(session.id);
  } catch (error) {
    spinner.fail('Request failed');
    printError(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
