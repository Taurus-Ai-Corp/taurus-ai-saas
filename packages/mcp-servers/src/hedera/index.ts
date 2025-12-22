/**
 * Hedera MCP Server - Main Entry Point
 * Provides blockchain tools via Model Context Protocol
 */

import { HederaToolExecutor } from './executor';
import { HederaClient } from './client';
import type { HederaConfig } from './types';

export * from './types';
export * from './client';
export * from './executor';
export * from './tools';

// MCP Server State
let hederaClient: HederaClient | null = null;
let toolExecutor: HederaToolExecutor | null = null;

/**
 * Initialize the Hedera MCP Server
 */
export async function initialize(config: HederaConfig): Promise<void> {
  hederaClient = new HederaClient(config);
  await hederaClient.connect();
  toolExecutor = new HederaToolExecutor(hederaClient);
}

/**
 * Get the tool executor instance
 */
export function getToolExecutor(): HederaToolExecutor {
  if (!toolExecutor) {
    throw new Error('Hedera MCP Server not initialized. Call initialize() first.');
  }
  return toolExecutor;
}

/**
 * Get the Hedera client instance
 */
export function getHederaClient(): HederaClient {
  if (!hederaClient) {
    throw new Error('Hedera MCP Server not initialized. Call initialize() first.');
  }
  return hederaClient;
}

/**
 * Shutdown the Hedera MCP Server
 */
export async function shutdown(): Promise<void> {
  if (hederaClient) {
    await hederaClient.disconnect();
    hederaClient = null;
    toolExecutor = null;
  }
}

/**
 * MCP Protocol Handler
 */
export async function handleMCPRequest(request: {
  method: string;
  params?: Record<string, unknown>;
}): Promise<unknown> {
  const { method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        protocolVersion: '2024-11-05',
        serverInfo: {
          name: 'hedera-mcp-server',
          version: '1.0.0',
        },
        capabilities: {
          tools: { listChanged: true },
        },
      };

    case 'tools/list':
      return {
        tools: getToolExecutor().listTools(),
      };

    case 'tools/call':
      if (!params?.name || !params?.arguments) {
        throw new Error('Missing tool name or arguments');
      }
      return await getToolExecutor().execute(
        params.name as string,
        params.arguments as Record<string, unknown>
      );

    default:
      throw new Error(`Unknown method: ${method}`);
  }
}
