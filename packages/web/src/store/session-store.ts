import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Session {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (session: Session | null) => void;
  addSession: (session: Session) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: [],
      currentSession: null,

      setSessions: (sessions) => set({ sessions }),

      setCurrentSession: (session) => set({ currentSession: session }),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSession: session,
        })),

      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSession:
            state.currentSession?.id === sessionId ? null : state.currentSession,
        })),

      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, ...updates } : s
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? { ...state.currentSession, ...updates }
              : state.currentSession,
        })),
    }),
    {
      name: 'taurus-sessions',
      partialize: (state) => ({
        sessions: state.sessions.slice(0, 50), // Keep last 50 sessions
      }),
    }
  )
);
