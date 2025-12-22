/**
 * API Client for Taurus AI CLI
 * Connects to the Fastify backend
 */

export interface Session {
  id: string;
  title?: string;
  time: {
    created: number;
    updated: number;
  };
}

export interface Message {
  info: {
    id: string;
    role: 'user' | 'assistant';
    sessionID: string;
    content?: string;
  };
  parts: Array<{
    type: 'text' | 'tool' | 'file';
    text?: string;
    tool?: string;
  }>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async listSessions(): Promise<Session[]> {
    const res = await fetch(`${this.baseUrl}/api/session`);
    if (!res.ok) throw new Error('Failed to list sessions');
    const data = await res.json();
    return data.sessions || [];
  }

  async createSession(title?: string): Promise<Session> {
    const res = await fetch(`${this.baseUrl}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    const data = await res.json();
    return data.session;
  }

  async getSession(id: string): Promise<Session> {
    // Try direct lookup first
    const res = await fetch(`${this.baseUrl}/api/session/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data.session;
    }

    // Fall back to partial ID match
    const sessions = await this.listSessions();
    const session = sessions.find(s => s.id.startsWith(id));
    if (!session) throw new Error('Session not found');
    return session;
  }

  async deleteSession(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/api/session/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    const res = await fetch(`${this.baseUrl}/api/session/${sessionId}/messages`);
    if (!res.ok) throw new Error('Failed to get messages');
    const data = await res.json();
    return data.messages || [];
  }

  async sendPrompt(
    sessionId: string,
    text: string,
    options?: { model?: string }
  ): Promise<Message> {
    const res = await fetch(`${this.baseUrl}/api/session/${sessionId}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parts: [{ type: 'text', text }],
        model: options?.model ? { providerID: 'anthropic', modelID: options.model } : undefined,
      }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to send prompt');
    }
    return res.json();
  }

  async subscribeToEvents(sessionId: string): Promise<EventSource> {
    const es = new EventSource(`${this.baseUrl}/api/session/${sessionId}/events`);
    return es;
  }
}
