/**
 * Taurus AI Core Types
 * Shared type definitions
 */

// Re-export SDK types
export type {
  Session,
  Message,
  UserMessage,
  AssistantMessage,
  Part,
  TextPart,
  ToolPart,
  FilePart,
  Event,
  Config,
  AgentConfig,
  ProviderConfig,
  Provider,
  Model,
  Agent,
} from '@opencode-ai/sdk';

// Taurus-specific types

/**
 * Taurus User (Firebase Auth integrated)
 */
export interface TaurusUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  providerId: string;
}

/**
 * Taurus Session (extended with user context)
 */
export interface TaurusSession {
  sessionId: string;
  userId: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  metadata?: {
    projectName?: string;
    language?: string;
    framework?: string;
    blockchain?: string;
  };
}

/**
 * Chat Message (simplified for UI)
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'pending' | 'streaming' | 'completed' | 'error';
  toolCalls?: ToolCall[];
}

/**
 * Tool Call (for blockchain operations)
 */
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'running' | 'completed' | 'error';
}

/**
 * Blockchain Network Configuration
 */
export interface BlockchainConfig {
  network: 'mainnet' | 'testnet' | 'previewnet' | 'localnet';
  operatorAccountId?: string;
  mirrorNodeUrl?: string;
}
