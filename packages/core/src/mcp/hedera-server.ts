/**
 * Hedera MCP Server Bridge
 * Connects OpenCode AI to Hedera blockchain via Model Context Protocol
 */

import type {
  MCPTool,
  MCPServerInfo,
  MCPCapabilities,
  MCPRequest,
  MCPResponse,
  ToolCallRequest,
  ToolCallResult,
  MCP_VERSION,
} from './types';

// Hedera Network Types
export type HederaNetwork = 'mainnet' | 'testnet' | 'previewnet' | 'localnet';

// Hedera Account ID format: 0.0.xxxxx
export type AccountId = `${number}.${number}.${number}`;

// Hedera Server Configuration
export interface HederaServerConfig {
  network: HederaNetwork;
  operatorAccountId?: AccountId;
  operatorPrivateKey?: string;
  mirrorNodeUrl?: string;
}

// Hedera MCP Server Implementation
export class HederaMCPServer {
  private config: HederaServerConfig;
  private tools: Map<string, MCPTool> = new Map();

  constructor(config: HederaServerConfig) {
    this.config = config;
    this.registerTools();
  }

  // Server Info
  getServerInfo(): MCPServerInfo {
    return {
      name: 'hedera-mcp-server',
      version: '1.0.0',
      protocolVersion: '2024-11-05',
      capabilities: this.getCapabilities(),
    };
  }

  // Server Capabilities
  getCapabilities(): MCPCapabilities {
    return {
      tools: { listChanged: true },
      resources: { subscribe: false, listChanged: false },
    };
  }

  // Register all Hedera tools
  private registerTools(): void {
    // Account Tools
    this.tools.set('hedera_get_account_balance', {
      name: 'hedera_get_account_balance',
      description: 'Get the HBAR and token balances for a Hedera account',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Hedera account ID (e.g., 0.0.12345)',
          },
        },
        required: ['accountId'],
      },
    });

    this.tools.set('hedera_get_account_info', {
      name: 'hedera_get_account_info',
      description: 'Get detailed information about a Hedera account',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Hedera account ID (e.g., 0.0.12345)',
          },
        },
        required: ['accountId'],
      },
    });

    this.tools.set('hedera_create_account', {
      name: 'hedera_create_account',
      description: 'Create a new Hedera account with initial balance',
      inputSchema: {
        type: 'object',
        properties: {
          initialBalance: {
            type: 'number',
            description: 'Initial balance in HBAR (default: 0)',
            default: 0,
          },
          memo: {
            type: 'string',
            description: 'Optional account memo',
          },
        },
      },
    });

    // Token Tools
    this.tools.set('hedera_create_token', {
      name: 'hedera_create_token',
      description: 'Create a new fungible or non-fungible token on Hedera',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Token name',
          },
          symbol: {
            type: 'string',
            description: 'Token symbol (3-100 characters)',
          },
          decimals: {
            type: 'number',
            description: 'Decimal places (0 for NFT)',
            default: 0,
          },
          initialSupply: {
            type: 'number',
            description: 'Initial token supply',
            default: 0,
          },
          tokenType: {
            type: 'string',
            description: 'Token type',
            enum: ['FUNGIBLE_COMMON', 'NON_FUNGIBLE_UNIQUE'],
            default: 'FUNGIBLE_COMMON',
          },
          treasuryAccountId: {
            type: 'string',
            description: 'Treasury account ID (defaults to operator)',
          },
        },
        required: ['name', 'symbol'],
      },
    });

    this.tools.set('hedera_transfer_token', {
      name: 'hedera_transfer_token',
      description: 'Transfer tokens between Hedera accounts',
      inputSchema: {
        type: 'object',
        properties: {
          tokenId: {
            type: 'string',
            description: 'Token ID (e.g., 0.0.12345)',
          },
          fromAccountId: {
            type: 'string',
            description: 'Sender account ID',
          },
          toAccountId: {
            type: 'string',
            description: 'Recipient account ID',
          },
          amount: {
            type: 'number',
            description: 'Amount to transfer',
          },
        },
        required: ['tokenId', 'fromAccountId', 'toAccountId', 'amount'],
      },
    });

    this.tools.set('hedera_associate_token', {
      name: 'hedera_associate_token',
      description: 'Associate a token with a Hedera account (required before receiving)',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Account ID to associate token with',
          },
          tokenId: {
            type: 'string',
            description: 'Token ID to associate',
          },
        },
        required: ['accountId', 'tokenId'],
      },
    });

    // Smart Contract Tools
    this.tools.set('hedera_deploy_contract', {
      name: 'hedera_deploy_contract',
      description: 'Deploy a smart contract to Hedera',
      inputSchema: {
        type: 'object',
        properties: {
          bytecode: {
            type: 'string',
            description: 'Contract bytecode (hex string)',
          },
          gas: {
            type: 'number',
            description: 'Gas limit for deployment',
            default: 100000,
          },
          constructorParameters: {
            type: 'string',
            description: 'ABI-encoded constructor parameters (hex)',
          },
          memo: {
            type: 'string',
            description: 'Contract memo',
          },
        },
        required: ['bytecode'],
      },
    });

    this.tools.set('hedera_call_contract', {
      name: 'hedera_call_contract',
      description: 'Call a smart contract function on Hedera',
      inputSchema: {
        type: 'object',
        properties: {
          contractId: {
            type: 'string',
            description: 'Contract ID (e.g., 0.0.12345)',
          },
          functionName: {
            type: 'string',
            description: 'Function name to call',
          },
          functionParameters: {
            type: 'string',
            description: 'ABI-encoded function parameters (hex)',
          },
          gas: {
            type: 'number',
            description: 'Gas limit',
            default: 100000,
          },
          payableAmount: {
            type: 'number',
            description: 'HBAR to send with call (in tinybars)',
            default: 0,
          },
        },
        required: ['contractId', 'functionName'],
      },
    });

    this.tools.set('hedera_query_contract', {
      name: 'hedera_query_contract',
      description: 'Query a smart contract (read-only, no transaction)',
      inputSchema: {
        type: 'object',
        properties: {
          contractId: {
            type: 'string',
            description: 'Contract ID (e.g., 0.0.12345)',
          },
          functionName: {
            type: 'string',
            description: 'Function name to query',
          },
          functionParameters: {
            type: 'string',
            description: 'ABI-encoded function parameters (hex)',
          },
          gas: {
            type: 'number',
            description: 'Gas limit',
            default: 100000,
          },
        },
        required: ['contractId', 'functionName'],
      },
    });

    // Consensus Service Tools
    this.tools.set('hedera_create_topic', {
      name: 'hedera_create_topic',
      description: 'Create a new topic on Hedera Consensus Service',
      inputSchema: {
        type: 'object',
        properties: {
          memo: {
            type: 'string',
            description: 'Topic memo/description',
          },
          adminKey: {
            type: 'string',
            description: 'Admin key (defaults to operator key)',
          },
          submitKey: {
            type: 'string',
            description: 'Submit key (if not set, anyone can submit)',
          },
        },
      },
    });

    this.tools.set('hedera_submit_message', {
      name: 'hedera_submit_message',
      description: 'Submit a message to a Hedera Consensus Service topic',
      inputSchema: {
        type: 'object',
        properties: {
          topicId: {
            type: 'string',
            description: 'Topic ID (e.g., 0.0.12345)',
          },
          message: {
            type: 'string',
            description: 'Message content (max 1024 bytes)',
          },
        },
        required: ['topicId', 'message'],
      },
    });

    this.tools.set('hedera_get_topic_messages', {
      name: 'hedera_get_topic_messages',
      description: 'Get messages from a Hedera Consensus Service topic',
      inputSchema: {
        type: 'object',
        properties: {
          topicId: {
            type: 'string',
            description: 'Topic ID (e.g., 0.0.12345)',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of messages to retrieve',
            default: 10,
          },
          sequenceNumber: {
            type: 'number',
            description: 'Start from this sequence number',
          },
        },
        required: ['topicId'],
      },
    });

    // File Service Tools
    this.tools.set('hedera_create_file', {
      name: 'hedera_create_file',
      description: 'Create a file on Hedera File Service',
      inputSchema: {
        type: 'object',
        properties: {
          contents: {
            type: 'string',
            description: 'File contents (max 1024 bytes per chunk)',
          },
          memo: {
            type: 'string',
            description: 'File memo',
          },
          expirationTime: {
            type: 'number',
            description: 'Expiration timestamp (seconds since epoch)',
          },
        },
        required: ['contents'],
      },
    });

    this.tools.set('hedera_get_file_contents', {
      name: 'hedera_get_file_contents',
      description: 'Get contents of a file from Hedera File Service',
      inputSchema: {
        type: 'object',
        properties: {
          fileId: {
            type: 'string',
            description: 'File ID (e.g., 0.0.12345)',
          },
        },
        required: ['fileId'],
      },
    });

    this.tools.set('hedera_append_file', {
      name: 'hedera_append_file',
      description: 'Append content to an existing file on Hedera',
      inputSchema: {
        type: 'object',
        properties: {
          fileId: {
            type: 'string',
            description: 'File ID (e.g., 0.0.12345)',
          },
          contents: {
            type: 'string',
            description: 'Content to append',
          },
        },
        required: ['fileId', 'contents'],
      },
    });

    // HBAR Transfer
    this.tools.set('hedera_transfer_hbar', {
      name: 'hedera_transfer_hbar',
      description: 'Transfer HBAR between accounts',
      inputSchema: {
        type: 'object',
        properties: {
          fromAccountId: {
            type: 'string',
            description: 'Sender account ID',
          },
          toAccountId: {
            type: 'string',
            description: 'Recipient account ID',
          },
          amount: {
            type: 'number',
            description: 'Amount in HBAR',
          },
          memo: {
            type: 'string',
            description: 'Transfer memo',
          },
        },
        required: ['fromAccountId', 'toAccountId', 'amount'],
      },
    });

    // Network Info
    this.tools.set('hedera_get_network_info', {
      name: 'hedera_get_network_info',
      description: 'Get current Hedera network information and status',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });
  }

  // List all available tools
  listTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  // Handle tool call request
  async callTool(request: ToolCallRequest): Promise<ToolCallResult> {
    const tool = this.tools.get(request.name);
    if (!tool) {
      return {
        content: [{ type: 'text', text: `Unknown tool: ${request.name}` }],
        isError: true,
      };
    }

    try {
      // Delegate to tool handlers (implemented in hedera SDK integration)
      const result = await this.executeTool(request.name, request.arguments);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing ${request.name}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }

  // Execute tool (placeholder - actual implementation in hedera package)
  private async executeTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    // This will be implemented by the actual Hedera SDK integration
    throw new Error(
      `Tool execution not implemented. Use HederaToolExecutor from @taurus-ai/mcp-servers`
    );
  }

  // Handle MCP protocol messages
  async handleMessage(request: MCPRequest): Promise<MCPResponse> {
    const { id, method, params } = request;

    try {
      switch (method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              serverInfo: this.getServerInfo(),
              capabilities: this.getCapabilities(),
            },
          };

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: { tools: this.listTools() },
          };

        case 'tools/call':
          const toolResult = await this.callTool(params as ToolCallRequest);
          return {
            jsonrpc: '2.0',
            id,
            result: toolResult,
          };

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          };
      }
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: (error as Error).message,
        },
      };
    }
  }
}

// Factory function for creating Hedera MCP server
export function createHederaMCPServer(config: HederaServerConfig): HederaMCPServer {
  return new HederaMCPServer(config);
}

// Export tool names for reference
export const HEDERA_TOOLS = {
  // Account
  GET_ACCOUNT_BALANCE: 'hedera_get_account_balance',
  GET_ACCOUNT_INFO: 'hedera_get_account_info',
  CREATE_ACCOUNT: 'hedera_create_account',
  // Token
  CREATE_TOKEN: 'hedera_create_token',
  TRANSFER_TOKEN: 'hedera_transfer_token',
  ASSOCIATE_TOKEN: 'hedera_associate_token',
  // Smart Contract
  DEPLOY_CONTRACT: 'hedera_deploy_contract',
  CALL_CONTRACT: 'hedera_call_contract',
  QUERY_CONTRACT: 'hedera_query_contract',
  // Consensus
  CREATE_TOPIC: 'hedera_create_topic',
  SUBMIT_MESSAGE: 'hedera_submit_message',
  GET_TOPIC_MESSAGES: 'hedera_get_topic_messages',
  // File
  CREATE_FILE: 'hedera_create_file',
  GET_FILE_CONTENTS: 'hedera_get_file_contents',
  APPEND_FILE: 'hedera_append_file',
  // HBAR
  TRANSFER_HBAR: 'hedera_transfer_hbar',
  // Network
  GET_NETWORK_INFO: 'hedera_get_network_info',
} as const;
