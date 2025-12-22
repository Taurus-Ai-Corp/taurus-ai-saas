/**
 * OpenCode SDK Wrapper Module
 * Provides typed wrappers for OpenCode AI SDK
 */

// Re-export SDK types and functions
export {
  createOpencode,
  createOpencodeClient,
  createOpencodeServer,
} from '@opencode-ai/sdk';

// Re-export all SDK types
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
