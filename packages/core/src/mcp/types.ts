/**
 * MCP (Model Context Protocol) Type Definitions
 * For integrating external tools and services with OpenCode AI
 */

// MCP Protocol Version
export const MCP_VERSION = '2024-11-05';

// Tool Input Schema (JSON Schema subset)
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

// MCP Tool Definition
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

// MCP Resource Definition
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// MCP Server Capabilities
export interface MCPCapabilities {
  tools?: { listChanged?: boolean };
  resources?: { subscribe?: boolean; listChanged?: boolean };
  prompts?: { listChanged?: boolean };
  logging?: Record<string, never>;
}

// MCP Server Info
export interface MCPServerInfo {
  name: string;
  version: string;
  protocolVersion: string;
  capabilities: MCPCapabilities;
}

// MCP Request Types
export interface MCPRequest<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: T;
}

// MCP Response Types
export interface MCPResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// MCP Notification Types
export interface MCPNotification<T = unknown> {
  jsonrpc: '2.0';
  method: string;
  params?: T;
}

// Tool Call Request
export interface ToolCallRequest {
  name: string;
  arguments: Record<string, unknown>;
}

// Tool Call Result
export interface ToolCallResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    uri?: string;
  }>;
  isError?: boolean;
}

// MCP Server Configuration
export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}

// OpenCode MCP Integration Config
export interface OpenCodeMCPConfig {
  mcpServers?: Record<string, MCPServerConfig>;
}
