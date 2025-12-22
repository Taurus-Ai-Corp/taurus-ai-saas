/**
 * Config Command
 * Manage CLI configuration
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';
import { printError, printInfo, printSuccess } from '../lib/display.js';

interface Config {
  apiUrl?: string;
  defaultModel?: string;
  theme?: 'dark' | 'light';
}

const CONFIG_DIR = path.join(os.homedir(), '.taurus');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Ignore errors, return default
  }
  return {};
}

function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

interface ConfigOptions {
  key?: string;
  value?: string;
}

export async function configCommand(
  action: string = 'show',
  options: ConfigOptions
): Promise<void> {
  switch (action) {
    case 'show':
    case 'list':
      showConfig();
      break;

    case 'set':
      if (!options.key) {
        printError('Key required. Use --key <key>');
        printInfo('Available keys: apiUrl, defaultModel, theme');
        process.exit(1);
      }
      if (!options.value) {
        printError('Value required. Use --value <value>');
        process.exit(1);
      }
      setConfig(options.key, options.value);
      break;

    case 'reset':
      resetConfig();
      break;

    case 'path':
      console.log(CONFIG_FILE);
      break;

    default:
      printError(`Unknown action: ${action}`);
      printInfo('Valid actions: show, set, reset, path');
      process.exit(1);
  }
}

function showConfig(): void {
  const config = loadConfig();

  console.log(chalk.bold('\n  Taurus AI Configuration\n'));
  console.log(chalk.dim(`  Config file: ${CONFIG_FILE}`));
  console.log();

  const defaults = {
    apiUrl: 'http://localhost:3001',
    defaultModel: 'claude-sonnet-4-20250514',
    theme: 'dark',
  };

  const rows = [
    ['apiUrl', config.apiUrl || chalk.dim(defaults.apiUrl + ' (default)')],
    ['defaultModel', config.defaultModel || chalk.dim(defaults.defaultModel + ' (default)')],
    ['theme', config.theme || chalk.dim(defaults.theme + ' (default)')],
  ];

  console.log(chalk.dim('  Key             Value'));
  console.log(chalk.dim('  ─────────────────────────────────────────'));

  for (const [key, value] of rows) {
    console.log(`  ${key.padEnd(16)}${value}`);
  }

  console.log();
  printInfo('Set config with: taurus config set --key <key> --value <value>');
}

function setConfig(key: string, value: string): void {
  const validKeys = ['apiUrl', 'defaultModel', 'theme'];

  if (!validKeys.includes(key)) {
    printError(`Invalid key: ${key}`);
    printInfo(`Valid keys: ${validKeys.join(', ')}`);
    process.exit(1);
  }

  // Validate theme
  if (key === 'theme' && !['dark', 'light'].includes(value)) {
    printError('Theme must be "dark" or "light"');
    process.exit(1);
  }

  const config = loadConfig();
  (config as Record<string, string>)[key] = value;
  saveConfig(config);

  printSuccess(`Set ${key} = ${value}`);
}

function resetConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
  printSuccess('Configuration reset to defaults');
}
