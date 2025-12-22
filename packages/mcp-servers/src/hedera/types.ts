/**
 * Hedera MCP Server Types
 */

// Network Configuration
export type HederaNetwork = 'mainnet' | 'testnet' | 'previewnet' | 'localnet';

// Account ID format
export type AccountId = string; // Format: 0.0.xxxxx

// Token ID format
export type TokenId = string; // Format: 0.0.xxxxx

// Topic ID format
export type TopicId = string; // Format: 0.0.xxxxx

// Contract ID format
export type ContractId = string; // Format: 0.0.xxxxx

// File ID format
export type FileId = string; // Format: 0.0.xxxxx

// Transaction ID format
export type TransactionId = string;

// Hedera Configuration
export interface HederaConfig {
  network: HederaNetwork;
  operatorAccountId?: AccountId;
  operatorPrivateKey?: string;
  mirrorNodeUrl?: string;
  maxTransactionFee?: number; // in tinybars
  maxQueryPayment?: number; // in tinybars
}

// Account Info
export interface AccountInfo {
  accountId: AccountId;
  balance: string; // in HBAR
  balanceTinybars: string;
  isDeleted: boolean;
  key: string;
  memo: string;
  ownedNfts: number;
  maxAutomaticTokenAssociations: number;
  ethereumNonce: number;
  stakingInfo?: {
    declineStakingReward: boolean;
    stakePeriodStart: string | null;
    pendingReward: string;
    stakedToMe: string;
    stakedAccountId: AccountId | null;
    stakedNodeId: number | null;
  };
}

// Token Balance
export interface TokenBalance {
  tokenId: TokenId;
  balance: string;
  decimals: number;
}

// Account Balance Response
export interface AccountBalance {
  accountId: AccountId;
  hbars: string;
  hbarsTinybars: string;
  tokens: TokenBalance[];
}

// Token Info
export interface TokenInfo {
  tokenId: TokenId;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  treasuryAccountId: AccountId;
  adminKey: string | null;
  kycKey: string | null;
  freezeKey: string | null;
  wipeKey: string | null;
  supplyKey: string | null;
  pauseKey: string | null;
  tokenType: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE';
  supplyType: 'INFINITE' | 'FINITE';
  maxSupply: string;
  memo: string;
  isDeleted: boolean;
  isPaused: boolean;
}

// Token Create Result
export interface TokenCreateResult {
  tokenId: TokenId;
  transactionId: TransactionId;
  status: string;
}

// Transfer Result
export interface TransferResult {
  transactionId: TransactionId;
  status: string;
  transfers: Array<{
    accountId: AccountId;
    amount: string;
  }>;
}

// Contract Create Result
export interface ContractCreateResult {
  contractId: ContractId;
  transactionId: TransactionId;
  status: string;
  gasUsed: number;
}

// Contract Call Result
export interface ContractCallResult {
  transactionId: TransactionId;
  status: string;
  gasUsed: number;
  result: string; // hex encoded
}

// Contract Query Result
export interface ContractQueryResult {
  result: string; // hex encoded
  gasUsed: number;
}

// Topic Create Result
export interface TopicCreateResult {
  topicId: TopicId;
  transactionId: TransactionId;
  status: string;
}

// Topic Message
export interface TopicMessage {
  consensusTimestamp: string;
  sequenceNumber: number;
  message: string;
  runningHash: string;
  topicId: TopicId;
}

// File Create Result
export interface FileCreateResult {
  fileId: FileId;
  transactionId: TransactionId;
  status: string;
}

// File Contents Result
export interface FileContentsResult {
  fileId: FileId;
  contents: string;
}

// Network Info
export interface NetworkInfo {
  network: HederaNetwork;
  mirrorNodeUrl: string;
  ledgerId: string;
  operatorAccountId?: AccountId;
}

// Tool Result
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  transactionId?: TransactionId;
}

// MCP Tool Content
export interface MCPContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

// MCP Tool Result
export interface MCPToolResult {
  content: MCPContent[];
  isError?: boolean;
}
