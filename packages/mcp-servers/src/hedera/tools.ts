/**
 * Hedera Tool Definitions
 * MCP-compatible tool schemas for Hedera blockchain operations
 */

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    default?: unknown;
  }>;
  required?: string[];
}

export interface HederaTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

/**
 * All Hedera MCP Tools
 */
export const HEDERA_TOOLS: Record<string, HederaTool> = {
  // ============================================
  // ACCOUNT TOOLS
  // ============================================

  hedera_get_account_balance: {
    name: 'hedera_get_account_balance',
    description: 'Get the HBAR and token balances for a Hedera account. Returns balance in HBAR and all associated token balances.',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Hedera account ID in format 0.0.xxxxx (e.g., 0.0.12345)',
        },
      },
      required: ['accountId'],
    },
  },

  hedera_get_account_info: {
    name: 'hedera_get_account_info',
    description: 'Get detailed information about a Hedera account including keys, memo, staking info, and owned NFTs.',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Hedera account ID in format 0.0.xxxxx',
        },
      },
      required: ['accountId'],
    },
  },

  hedera_create_account: {
    name: 'hedera_create_account',
    description: 'Create a new Hedera account with optional initial HBAR balance. Returns the new account ID.',
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
          description: 'Optional memo for the account (max 100 bytes)',
        },
      },
    },
  },

  // ============================================
  // TOKEN TOOLS
  // ============================================

  hedera_create_token: {
    name: 'hedera_create_token',
    description: 'Create a new fungible or non-fungible token (NFT) on Hedera Token Service.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Token name (e.g., "My Token")',
        },
        symbol: {
          type: 'string',
          description: 'Token symbol (3-100 characters, e.g., "MTK")',
        },
        decimals: {
          type: 'number',
          description: 'Decimal places for fungible tokens (0 for NFT)',
          default: 0,
        },
        initialSupply: {
          type: 'number',
          description: 'Initial supply (for fungible tokens)',
          default: 0,
        },
        tokenType: {
          type: 'string',
          description: 'Token type: FUNGIBLE_COMMON or NON_FUNGIBLE_UNIQUE',
          enum: ['FUNGIBLE_COMMON', 'NON_FUNGIBLE_UNIQUE'],
          default: 'FUNGIBLE_COMMON',
        },
        treasuryAccountId: {
          type: 'string',
          description: 'Treasury account ID (defaults to operator account)',
        },
      },
      required: ['name', 'symbol'],
    },
  },

  hedera_transfer_token: {
    name: 'hedera_transfer_token',
    description: 'Transfer fungible tokens between Hedera accounts. The recipient must have the token associated.',
    inputSchema: {
      type: 'object',
      properties: {
        tokenId: {
          type: 'string',
          description: 'Token ID in format 0.0.xxxxx',
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
          description: 'Amount to transfer (considering decimals)',
        },
      },
      required: ['tokenId', 'fromAccountId', 'toAccountId', 'amount'],
    },
  },

  hedera_associate_token: {
    name: 'hedera_associate_token',
    description: 'Associate a token with a Hedera account. Required before the account can receive the token.',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Account ID to associate the token with',
        },
        tokenId: {
          type: 'string',
          description: 'Token ID to associate',
        },
      },
      required: ['accountId', 'tokenId'],
    },
  },

  // ============================================
  // SMART CONTRACT TOOLS
  // ============================================

  hedera_deploy_contract: {
    name: 'hedera_deploy_contract',
    description: 'Deploy a Solidity smart contract to Hedera. Returns the contract ID.',
    inputSchema: {
      type: 'object',
      properties: {
        bytecode: {
          type: 'string',
          description: 'Compiled contract bytecode (hex string, without 0x prefix)',
        },
        gas: {
          type: 'number',
          description: 'Gas limit for deployment transaction',
          default: 100000,
        },
        constructorParameters: {
          type: 'string',
          description: 'ABI-encoded constructor parameters (hex string)',
        },
        memo: {
          type: 'string',
          description: 'Contract memo',
        },
      },
      required: ['bytecode'],
    },
  },

  hedera_call_contract: {
    name: 'hedera_call_contract',
    description: 'Call a smart contract function that modifies state. Creates a transaction.',
    inputSchema: {
      type: 'object',
      properties: {
        contractId: {
          type: 'string',
          description: 'Contract ID in format 0.0.xxxxx',
        },
        functionName: {
          type: 'string',
          description: 'Function name to call',
        },
        functionParameters: {
          type: 'string',
          description: 'ABI-encoded function parameters (hex string)',
        },
        gas: {
          type: 'number',
          description: 'Gas limit for the call',
          default: 100000,
        },
        payableAmount: {
          type: 'number',
          description: 'HBAR to send with call (in tinybars, 1 HBAR = 100,000,000 tinybars)',
          default: 0,
        },
      },
      required: ['contractId', 'functionName'],
    },
  },

  hedera_query_contract: {
    name: 'hedera_query_contract',
    description: 'Query a smart contract function (read-only, no transaction). Does not modify state.',
    inputSchema: {
      type: 'object',
      properties: {
        contractId: {
          type: 'string',
          description: 'Contract ID in format 0.0.xxxxx',
        },
        functionName: {
          type: 'string',
          description: 'Function name to query',
        },
        functionParameters: {
          type: 'string',
          description: 'ABI-encoded function parameters (hex string)',
        },
        gas: {
          type: 'number',
          description: 'Gas limit for query',
          default: 100000,
        },
      },
      required: ['contractId', 'functionName'],
    },
  },

  // ============================================
  // CONSENSUS SERVICE TOOLS
  // ============================================

  hedera_create_topic: {
    name: 'hedera_create_topic',
    description: 'Create a new topic on Hedera Consensus Service (HCS) for ordered, timestamped messages.',
    inputSchema: {
      type: 'object',
      properties: {
        memo: {
          type: 'string',
          description: 'Topic memo/description',
        },
        adminKey: {
          type: 'string',
          description: 'Admin key for topic management (defaults to operator key)',
        },
        submitKey: {
          type: 'string',
          description: 'Submit key required to post messages (if not set, anyone can submit)',
        },
      },
    },
  },

  hedera_submit_message: {
    name: 'hedera_submit_message',
    description: 'Submit a message to a Hedera Consensus Service topic. Messages are ordered and timestamped.',
    inputSchema: {
      type: 'object',
      properties: {
        topicId: {
          type: 'string',
          description: 'Topic ID in format 0.0.xxxxx',
        },
        message: {
          type: 'string',
          description: 'Message content (max 1024 bytes)',
        },
      },
      required: ['topicId', 'message'],
    },
  },

  hedera_get_topic_messages: {
    name: 'hedera_get_topic_messages',
    description: 'Retrieve messages from a Hedera Consensus Service topic via mirror node.',
    inputSchema: {
      type: 'object',
      properties: {
        topicId: {
          type: 'string',
          description: 'Topic ID in format 0.0.xxxxx',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of messages to retrieve',
          default: 10,
        },
        sequenceNumber: {
          type: 'number',
          description: 'Start from this sequence number (for pagination)',
        },
      },
      required: ['topicId'],
    },
  },

  // ============================================
  // FILE SERVICE TOOLS
  // ============================================

  hedera_create_file: {
    name: 'hedera_create_file',
    description: 'Create a file on Hedera File Service. Files are immutable and have an expiration.',
    inputSchema: {
      type: 'object',
      properties: {
        contents: {
          type: 'string',
          description: 'File contents (max 1024 bytes per transaction)',
        },
        memo: {
          type: 'string',
          description: 'File memo',
        },
        expirationTime: {
          type: 'number',
          description: 'Expiration timestamp in seconds since epoch',
        },
      },
      required: ['contents'],
    },
  },

  hedera_get_file_contents: {
    name: 'hedera_get_file_contents',
    description: 'Get the contents of a file from Hedera File Service.',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: {
          type: 'string',
          description: 'File ID in format 0.0.xxxxx',
        },
      },
      required: ['fileId'],
    },
  },

  hedera_append_file: {
    name: 'hedera_append_file',
    description: 'Append content to an existing file on Hedera File Service.',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: {
          type: 'string',
          description: 'File ID in format 0.0.xxxxx',
        },
        contents: {
          type: 'string',
          description: 'Content to append (max 1024 bytes per transaction)',
        },
      },
      required: ['fileId', 'contents'],
    },
  },

  // ============================================
  // HBAR TRANSFER
  // ============================================

  hedera_transfer_hbar: {
    name: 'hedera_transfer_hbar',
    description: 'Transfer HBAR cryptocurrency between Hedera accounts.',
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
          description: 'Amount in HBAR to transfer',
        },
        memo: {
          type: 'string',
          description: 'Transfer memo (max 100 bytes)',
        },
      },
      required: ['fromAccountId', 'toAccountId', 'amount'],
    },
  },

  // ============================================
  // NETWORK INFO
  // ============================================

  hedera_get_network_info: {
    name: 'hedera_get_network_info',
    description: 'Get current Hedera network configuration and status including connected network and operator account.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
};

// Export tool names for reference
export const TOOL_NAMES = Object.keys(HEDERA_TOOLS) as Array<keyof typeof HEDERA_TOOLS>;
