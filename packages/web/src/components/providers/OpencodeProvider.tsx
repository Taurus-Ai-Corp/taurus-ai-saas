'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// Types
interface Session {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'pending' | 'streaming' | 'completed' | 'error';
  toolCalls?: ToolCall[];
}

interface ToolCall {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'error';
  result?: string;
}

interface OpencodeContextValue {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Session management
  sessions: Session[];
  currentSession: Session | null;
  createSession: (title?: string) => Promise<Session>;
  selectSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Messages
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (content: string) => Promise<void>;
  abortMessage: () => Promise<void>;

  // API URL
  apiUrl: string;
}

const OpencodeContext = createContext<OpencodeContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function OpencodeProvider({ children }: { children: ReactNode }) {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // Event source for SSE
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Initialize connection
  useEffect(() => {
    const connect = async () => {
      try {
        setIsConnecting(true);
        const res = await fetch(`${API_URL}/health`);
        if (res.ok) {
          setIsConnected(true);
          await loadSessions();
        } else {
          throw new Error('API not available');
        }
      } catch (err) {
        setError('Failed to connect to API server');
        console.error('Connection error:', err);
      } finally {
        setIsConnecting(false);
      }
    };

    connect();

    return () => {
      eventSource?.close();
    };
  }, []);

  // Load sessions
  const loadSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/session`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  // Create session
  const createSession = useCallback(async (title?: string): Promise<Session> => {
    const res = await fetch(`${API_URL}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title || 'New Chat' }),
    });

    const data = await res.json();
    const session = data.session;

    setSessions((prev) => [session, ...prev]);
    setCurrentSession(session);
    setMessages([]);

    // Subscribe to events
    subscribeToEvents(session.id);

    return session;
  }, []);

  // Select session
  const selectSession = useCallback(async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setCurrentSession(session);

    // Load messages
    try {
      const res = await fetch(`${API_URL}/api/session/${sessionId}/messages`);
      const data = await res.json();
      setMessages(
        data.messages?.map((m: any) => ({
          id: m.info.id,
          role: m.info.role,
          content: m.parts
            ?.filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('') || '',
          timestamp: m.info.time?.created || Date.now(),
          status: 'completed',
        })) || []
      );
    } catch (err) {
      console.error('Failed to load messages:', err);
    }

    // Subscribe to events
    subscribeToEvents(sessionId);
  }, [sessions]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: string) => {
    await fetch(`${API_URL}/api/session/${sessionId}`, { method: 'DELETE' });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
      setMessages([]);
    }
  }, [currentSession]);

  // Subscribe to SSE events
  const subscribeToEvents = useCallback((sessionId: string) => {
    // Close existing connection
    eventSource?.close();

    const es = new EventSource(`${API_URL}/api/session/${sessionId}/events`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleEvent(data);
      } catch (err) {
        console.error('Failed to parse event:', err);
      }
    };

    es.onerror = () => {
      console.error('SSE connection error');
      es.close();
    };

    setEventSource(es);
  }, [eventSource]);

  // Handle SSE events
  const handleEvent = useCallback((event: any) => {
    switch (event.type) {
      case 'message.part.updated':
        if (event.properties?.delta) {
          setStreamingContent((prev) => prev + event.properties.delta);
        }
        break;

      case 'session.status':
        if (event.properties?.status?.type === 'idle') {
          // Streaming complete
          if (streamingContent) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: streamingContent,
                timestamp: Date.now(),
                status: 'completed',
              },
            ]);
            setStreamingContent('');
          }
          setIsLoading(false);
        }
        break;
    }
  }, [streamingContent]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    let sessionId = currentSession?.id;

    if (!sessionId) {
      // Create new session first
      const session = await createSession();
      sessionId = session.id;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'completed',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const res = await fetch(`${API_URL}/api/session/${sessionId}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parts: [{ type: 'text', text: content }],
        }),
      });

      // Handle synchronous response (standalone mode)
      if (res.ok) {
        const data = await res.json();
        if (data.parts) {
          const assistantContent = data.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('');

          if (assistantContent) {
            setMessages((prev) => [
              ...prev,
              {
                id: data.info?.id || Date.now().toString(),
                role: 'assistant',
                content: assistantContent,
                timestamp: Date.now(),
                status: 'completed',
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, createSession]);

  // Abort message
  const abortMessage = useCallback(async () => {
    if (!currentSession) return;

    try {
      await fetch(`${API_URL}/api/session/${currentSession.id}/abort`, {
        method: 'POST',
      });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to abort:', err);
    }
  }, [currentSession]);

  const value: OpencodeContextValue = {
    isConnected,
    isConnecting,
    error,
    sessions,
    currentSession,
    createSession,
    selectSession,
    deleteSession,
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    abortMessage,
    apiUrl: API_URL,
  };

  return (
    <OpencodeContext.Provider value={value}>
      {children}
    </OpencodeContext.Provider>
  );
}

export function useOpencode() {
  const context = useContext(OpencodeContext);
  if (!context) {
    throw new Error('useOpencode must be used within OpencodeProvider');
  }
  return context;
}
