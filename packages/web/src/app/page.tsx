'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { useSessionStore } from '@/store/session-store';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentSession } = useSessionStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg font-semibold">
            {currentSession?.title || 'New Chat'}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              Hedera Testnet
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <ChatContainer />
      </main>
    </div>
  );
}
