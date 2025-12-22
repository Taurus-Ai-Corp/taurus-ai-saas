/**
 * Display utilities for CLI output
 */

import chalk from 'chalk';

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function formatSessionRow(session: { id: string; title?: string; time: { updated: number } }): string {
  const id = chalk.gray(session.id.slice(0, 8));
  const title = chalk.white(session.title || 'Untitled');
  const time = chalk.dim(formatTimestamp(session.time.updated));
  return `  ${id}  ${title.padEnd(30)}  ${time}`;
}

export function printUser(text: string): void {
  console.log();
  console.log(chalk.blue.bold('You:'));
  console.log(chalk.white(`  ${text}`));
}

export function printAssistant(text: string): void {
  console.log();
  console.log(chalk.green.bold('Taurus:'));
  // Handle multi-line responses with proper indentation
  const lines = text.split('\n');
  for (const line of lines) {
    console.log(chalk.white(`  ${line}`));
  }
}

export function printError(message: string): void {
  console.error(chalk.red.bold('Error:'), chalk.red(message));
}

export function printWarning(message: string): void {
  console.warn(chalk.yellow.bold('Warning:'), chalk.yellow(message));
}

export function printInfo(message: string): void {
  console.log(chalk.cyan('ℹ'), chalk.cyan(message));
}

export function printSuccess(message: string): void {
  console.log(chalk.green('✓'), chalk.green(message));
}

export function printTable(headers: string[], rows: string[][]): void {
  // Calculate column widths
  const widths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map(r => (r[i] || '').length));
    return Math.max(h.length, maxRowWidth);
  });

  // Print header
  const headerLine = headers.map((h, i) => h.padEnd(widths[i])).join('  ');
  console.log(chalk.bold(headerLine));
  console.log(chalk.dim('─'.repeat(headerLine.length)));

  // Print rows
  for (const row of rows) {
    const line = row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  ');
    console.log(line);
  }
}

export function printCodeBlock(code: string, language?: string): void {
  console.log(chalk.dim('```' + (language || '')));
  console.log(chalk.white(code));
  console.log(chalk.dim('```'));
}

export function clearLine(): void {
  process.stdout.write('\r\x1b[K');
}

export function printStreaming(text: string): void {
  process.stdout.write(text);
}
