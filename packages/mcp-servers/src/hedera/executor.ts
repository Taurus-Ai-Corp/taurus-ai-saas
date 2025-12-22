/**
 * Hedera Tool Executor
 * Handles execution of Hedera blockchain tools via MCP
 */

import { HederaClient } from './client';
import { HEDERA_TOOLS, type HederaTool } from './tools';
import type { MCPToolResult, ToolResult } from './types';

/**
 * Tool Executor - Bridges MCP requests to Hedera client operations
 */
export class HederaToolExecutor {
  private client: HederaClient;

  constructor(client: HederaClient) {
    this.client = client;
  }

  /**
   * List all available tools
   */
  listTools(): HederaTool[] {
    return Object.values(HEDERA_TOOLS);
  }

  /**
   * Execute a tool by name
   */
  async execute(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResult> {
    try {
      const result = await this.executeInternal(toolName, args);
      return this.formatResult(result);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Internal execution dispatcher
   */
  private async executeInternal(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<ToolResult> {
    switch (toolName) {
      // Account operations
      case 'hedera_get_account_balance':
        return this.getAccountBalance(args);
      case 'hedera_get_account_info':
        return this.getAccountInfo(args);
      case 'hedera_create_account':
        return this.createAccount(args);

      // Token operations
      case 'hedera_create_token':
        return this.createToken(args);
      case 'hedera_transfer_token':
        return this.transferToken(args);
      case 'hedera_associate_token':
        return this.associateToken(args);

      // Smart contract operations
      case 'hedera_deploy_contract':
        return this.deployContract(args);
      case 'hedera_call_contract':
        return this.callContract(args);
      case 'hedera_query_contract':
        return this.queryContract(args);

      // Consensus service operations
      case 'hedera_create_topic':
        return this.createTopic(args);
      case 'hedera_submit_message':
        return this.submitMessage(args);
      case 'hedera_get_topic_messages':
        return this.getTopicMessages(args);

      // File service operations
      case 'hedera_create_file':
        return this.createFile(args);
      case 'hedera_get_file_contents':
        return this.getFileContents(args);
      case 'hedera_append_file':
        return this.appendFile(args);

      // HBAR transfer
      case 'hedera_transfer_hbar':
        return this.transferHbar(args);

      // Network info
      case 'hedera_get_network_info':
        return this.getNetworkInfo();

      default:
        return {
          success: false,
          error: `Unknown tool: ${toolName}`,
        };
    }
  }

  /**
   * Format result for MCP response
   */
  private formatResult(result: ToolResult): MCPToolResult {
    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${result.error}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  }

  // Tool implementations

  private async getAccountBalance(args: Record<string, unknown>): Promise<ToolResult> {
    const accountId = args.accountId as string;
    if (!accountId) {
      return { success: false, error: 'accountId is required' };
    }

    const balance = await this.client.getAccountBalance(accountId);
    return { success: true, data: balance };
  }

  private async getAccountInfo(args: Record<string, unknown>): Promise<ToolResult> {
    const accountId = args.accountId as string;
    if (!accountId) {
      return { success: false, error: 'accountId is required' };
    }

    const info = await this.client.getAccountInfo(accountId);
    return { success: true, data: info };
  }

  private async createAccount(args: Record<string, unknown>): Promise<ToolResult> {
    const initialBalance = (args.initialBalance as number) || 0;
    const memo = args.memo as string | undefined;

    const result = await this.client.createAccount(initialBalance, memo);
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async createToken(args: Record<string, unknown>): Promise<ToolResult> {
    const name = args.name as string;
    const symbol = args.symbol as string;
    if (!name || !symbol) {
      return { success: false, error: 'name and symbol are required' };
    }

    const result = await this.client.createToken({
      name,
      symbol,
      decimals: (args.decimals as number) || 0,
      initialSupply: (args.initialSupply as number) || 0,
      tokenType: (args.tokenType as 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE') || 'FUNGIBLE_COMMON',
      treasuryAccountId: args.treasuryAccountId as string | undefined,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async transferToken(args: Record<string, unknown>): Promise<ToolResult> {
    const { tokenId, fromAccountId, toAccountId, amount } = args as {
      tokenId: string;
      fromAccountId: string;
      toAccountId: string;
      amount: number;
    };

    if (!tokenId || !fromAccountId || !toAccountId || amount === undefined) {
      return { success: false, error: 'tokenId, fromAccountId, toAccountId, and amount are required' };
    }

    const result = await this.client.transferToken({
      tokenId,
      fromAccountId,
      toAccountId,
      amount,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async associateToken(args: Record<string, unknown>): Promise<ToolResult> {
    const { accountId, tokenId } = args as { accountId: string; tokenId: string };
    if (!accountId || !tokenId) {
      return { success: false, error: 'accountId and tokenId are required' };
    }

    const result = await this.client.associateToken(accountId, tokenId);
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async deployContract(args: Record<string, unknown>): Promise<ToolResult> {
    const bytecode = args.bytecode as string;
    if (!bytecode) {
      return { success: false, error: 'bytecode is required' };
    }

    const result = await this.client.deployContract({
      bytecode,
      gas: (args.gas as number) || 100000,
      constructorParameters: args.constructorParameters as string | undefined,
      memo: args.memo as string | undefined,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async callContract(args: Record<string, unknown>): Promise<ToolResult> {
    const { contractId, functionName } = args as { contractId: string; functionName: string };
    if (!contractId || !functionName) {
      return { success: false, error: 'contractId and functionName are required' };
    }

    const result = await this.client.callContract({
      contractId,
      functionName,
      functionParameters: args.functionParameters as string | undefined,
      gas: (args.gas as number) || 100000,
      payableAmount: (args.payableAmount as number) || 0,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async queryContract(args: Record<string, unknown>): Promise<ToolResult> {
    const { contractId, functionName } = args as { contractId: string; functionName: string };
    if (!contractId || !functionName) {
      return { success: false, error: 'contractId and functionName are required' };
    }

    const result = await this.client.queryContract({
      contractId,
      functionName,
      functionParameters: args.functionParameters as string | undefined,
      gas: (args.gas as number) || 100000,
    });
    return { success: true, data: result };
  }

  private async createTopic(args: Record<string, unknown>): Promise<ToolResult> {
    const result = await this.client.createTopic({
      memo: args.memo as string | undefined,
      adminKey: args.adminKey as string | undefined,
      submitKey: args.submitKey as string | undefined,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async submitMessage(args: Record<string, unknown>): Promise<ToolResult> {
    const { topicId, message } = args as { topicId: string; message: string };
    if (!topicId || !message) {
      return { success: false, error: 'topicId and message are required' };
    }

    const result = await this.client.submitMessage(topicId, message);
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async getTopicMessages(args: Record<string, unknown>): Promise<ToolResult> {
    const topicId = args.topicId as string;
    if (!topicId) {
      return { success: false, error: 'topicId is required' };
    }

    const messages = await this.client.getTopicMessages(
      topicId,
      (args.limit as number) || 10,
      args.sequenceNumber as number | undefined
    );
    return { success: true, data: { topicId, messages } };
  }

  private async createFile(args: Record<string, unknown>): Promise<ToolResult> {
    const contents = args.contents as string;
    if (!contents) {
      return { success: false, error: 'contents is required' };
    }

    const result = await this.client.createFile({
      contents,
      memo: args.memo as string | undefined,
      expirationTime: args.expirationTime as number | undefined,
    });
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async getFileContents(args: Record<string, unknown>): Promise<ToolResult> {
    const fileId = args.fileId as string;
    if (!fileId) {
      return { success: false, error: 'fileId is required' };
    }

    const result = await this.client.getFileContents(fileId);
    return { success: true, data: result };
  }

  private async appendFile(args: Record<string, unknown>): Promise<ToolResult> {
    const { fileId, contents } = args as { fileId: string; contents: string };
    if (!fileId || !contents) {
      return { success: false, error: 'fileId and contents are required' };
    }

    const result = await this.client.appendFile(fileId, contents);
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async transferHbar(args: Record<string, unknown>): Promise<ToolResult> {
    const { fromAccountId, toAccountId, amount, memo } = args as {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      memo?: string;
    };

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return { success: false, error: 'fromAccountId, toAccountId, and amount are required' };
    }

    const result = await this.client.transferHbar(fromAccountId, toAccountId, amount, memo);
    return { success: true, data: result, transactionId: result.transactionId };
  }

  private async getNetworkInfo(): Promise<ToolResult> {
    const info = await this.client.getNetworkInfo();
    return { success: true, data: info };
  }
}
