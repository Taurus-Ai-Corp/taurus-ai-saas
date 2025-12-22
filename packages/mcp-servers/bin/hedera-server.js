#!/usr/bin/env node
/**
 * Hedera MCP Server - Standalone executable
 * Provides Hedera blockchain tools via Model Context Protocol
 */

import { createInterface } from 'readline';
import { initialize, handleMCPRequest, shutdown } from '../dist/hedera/index.js';

// Get configuration from environment
const config = {
  network: process.env.HEDERA_NETWORK || 'testnet',
  operatorAccountId: process.env.HEDERA_OPERATOR_ID,
  operatorPrivateKey: process.env.HEDERA_OPERATOR_KEY,
  mirrorNodeUrl: process.env.HEDERA_MIRROR_NODE,
};

// JSON-RPC message handling
async function handleMessage(line) {
  try {
    const request = JSON.parse(line);
    const result = await handleMCPRequest(request);

    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result,
    };

    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (error) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: error.message || 'Parse error',
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
}

// Main entry point
async function main() {
  console.error(`Starting Hedera MCP Server (${config.network})...`);

  try {
    await initialize(config);
    console.error('Hedera MCP Server initialized');

    // Set up stdin reader for MCP protocol
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', handleMessage);

    rl.on('close', async () => {
      console.error('Shutting down Hedera MCP Server...');
      await shutdown();
      process.exit(0);
    });

    // Handle signals
    process.on('SIGINT', async () => {
      await shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await shutdown();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start Hedera MCP Server:', error.message);
    process.exit(1);
  }
}

main();
