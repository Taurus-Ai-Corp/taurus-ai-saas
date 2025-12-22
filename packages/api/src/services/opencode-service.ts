/**
 * OpenCode Service
 * Manages OpenCode server and client connections
 * Falls back to standalone mode if OpenCode CLI is not available
 */

import Anthropic from '@anthropic-ai/sdk';

export interface Session {
  id: string;
  title?: string;
  time: {
    created: number;
    updated: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  sessionID: string;
  content?: string;
}

export interface Part {
  type: 'text' | 'tool' | 'file';
  text?: string;
  tool?: string;
}

// In-memory session storage (use MongoDB in production)
const sessions = new Map<string, Session>();
const sessionMessages = new Map<string, Array<{ info: Message; parts: Part[] }>>();

export class OpencodeService {
  private client: any = null;
  private anthropic: Anthropic | null = null;
  private initialized = false;
  private standaloneMode = false;
  private serverUrl = 'http://127.0.0.1:4096';

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Try to connect to existing OpenCode server
    const existingUrl = process.env.OPENCODE_URL || 'http://127.0.0.1:4096';

    try {
      const res = await fetch(`${existingUrl}/api/v1/config`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        // Dynamic import to avoid issues if SDK has CLI dependency
        const { createOpencodeClient } = await import('@opencode-ai/sdk');
        this.client = createOpencodeClient({ baseUrl: existingUrl });
        this.serverUrl = existingUrl;
        console.log('Connected to OpenCode server:', existingUrl);
        this.initialized = true;
        return;
      }
    } catch {
      // Server not available
    }

    // Fall back to standalone mode with direct Anthropic API
    console.log('OpenCode server not available, using standalone mode');
    this.standaloneMode = true;

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      console.log('Anthropic API initialized');
    }

    this.initialized = true;
  }

  async shutdown(): Promise<void> {
    this.client = null;
    this.anthropic = null;
    this.initialized = false;
  }

  getClient() {
    return this.client;
  }

  getServerUrl(): string {
    return this.serverUrl;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isStandaloneMode(): boolean {
    return this.standaloneMode;
  }

  // Session operations

  async listSessions(): Promise<Session[]> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.list();
      return response.data || [];
    }

    // Standalone mode
    return Array.from(sessions.values()).sort(
      (a, b) => b.time.updated - a.time.updated
    );
  }

  async getSession(id: string): Promise<Session> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.get({ path: { id } });
      if (!response.data) throw new Error('Session not found');
      return response.data;
    }

    // Standalone mode
    const session = sessions.get(id);
    if (!session) throw new Error('Session not found');
    return session;
  }

  async createSession(title?: string): Promise<Session> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.create({
        body: { title: title || 'New Chat' },
      });
      if (!response.data) throw new Error('Failed to create session');
      return response.data;
    }

    // Standalone mode
    const session: Session = {
      id: crypto.randomUUID(),
      title: title || 'New Chat',
      time: {
        created: Date.now(),
        updated: Date.now(),
      },
    };
    sessions.set(session.id, session);
    sessionMessages.set(session.id, []);
    return session;
  }

  async deleteSession(id: string): Promise<boolean> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.delete({ path: { id } });
      return response.data || false;
    }

    // Standalone mode
    sessions.delete(id);
    sessionMessages.delete(id);
    return true;
  }

  // Message operations

  async getMessages(sessionId: string): Promise<Array<{ info: Message; parts: Part[] }>> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.messages({
        path: { id: sessionId },
      });
      return response.data || [];
    }

    // Standalone mode
    return sessionMessages.get(sessionId) || [];
  }

  async prompt(
    sessionId: string,
    parts: Array<{ type: string; text?: string }>,
    options?: {
      model?: { providerID: string; modelID: string };
      agent?: string;
      noReply?: boolean;
    }
  ): Promise<{ info: Message; parts: Part[] }> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.prompt({
        path: { id: sessionId },
        body: {
          parts,
          model: options?.model,
          agent: options?.agent,
          noReply: options?.noReply,
        },
      });
      if (!response.data) throw new Error('Failed to send prompt');
      return response.data;
    }

    // Standalone mode with Anthropic
    if (!this.anthropic) {
      throw new Error('Anthropic API not configured');
    }

    const session = sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      sessionID: sessionId,
    };
    const userParts: Part[] = parts.map((p) => ({
      type: p.type as 'text',
      text: p.text,
    }));

    const messages = sessionMessages.get(sessionId) || [];
    messages.push({ info: userMessage, parts: userParts });

    if (options?.noReply) {
      return { info: userMessage, parts: userParts };
    }

    // Get conversation history
    const history = messages.map((m) => ({
      role: m.info.role as 'user' | 'assistant',
      content: m.parts.map((p) => p.text || '').join(''),
    }));

    // Call Anthropic API
    const response = await this.anthropic.messages.create({
      model: options?.model?.modelID || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: history,
    });

    // Extract text content
    const assistantText = response.content
      .filter((c): c is Anthropic.TextBlock => c.type === 'text')
      .map((c) => c.text)
      .join('');

    // Add assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      sessionID: sessionId,
      content: assistantText,
    };
    const assistantParts: Part[] = [{ type: 'text', text: assistantText }];
    messages.push({ info: assistantMessage, parts: assistantParts });

    // Update session
    session.time.updated = Date.now();
    sessionMessages.set(sessionId, messages);

    return { info: assistantMessage, parts: assistantParts };
  }

  async promptAsync(
    sessionId: string,
    parts: Array<{ type: string; text?: string }>,
    options?: {
      model?: { providerID: string; modelID: string };
      agent?: string;
    }
  ): Promise<void> {
    if (!this.standaloneMode && this.client) {
      await this.client.session.promptAsync({
        path: { id: sessionId },
        body: {
          parts,
          model: options?.model,
          agent: options?.agent,
        },
      });
      return;
    }

    // In standalone mode, just call prompt synchronously
    await this.prompt(sessionId, parts, options);
  }

  async abortSession(sessionId: string): Promise<boolean> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.session.abort({ path: { id: sessionId } });
      return response.data || false;
    }

    // Standalone mode - nothing to abort
    return true;
  }

  // Event subscription (not available in standalone mode)
  async *subscribeToEvents(): AsyncGenerator<any> {
    if (!this.standaloneMode && this.client) {
      const response = await this.client.event.subscribe();
      yield* response.stream;
      return;
    }

    // Standalone mode - yield nothing
    while (false) {
      yield;
    }
  }
}
