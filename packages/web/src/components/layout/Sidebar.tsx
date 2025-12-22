'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronLeft,
  Trash2,
  Coins,
  Database,
  Github,
} from 'lucide-react';
import { useOpencode } from '@/components/providers/OpencodeProvider';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { sessions, currentSession, createSession, selectSession, deleteSession } = useOpencode();

  const handleNewChat = async () => {
    await createSession('New Chat');
  };

  return (
    <aside
      className={clsx(
        'flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300',
        isOpen ? 'w-64' : 'w-0 lg:w-16'
      )}
    >
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-3">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hedera-purple to-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold">Taurus AI</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={clsx('w-4 h-4 transition-transform', !isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className={clsx(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-primary-600 hover:bg-primary-500 text-white transition-colors',
            !isOpen && 'justify-center'
          )}
        >
          <Plus className="w-4 h-4" />
          {isOpen && <span>New Chat</span>}
        </button>
      </div>

      {/* Sessions List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Recent Chats
          </div>
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={clsx(
                  'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                  currentSession?.id === session.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
                onClick={() => selectSession(session.id)}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate text-sm">
                  {session.title || 'Untitled'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      {isOpen && (
        <div className="border-t border-gray-800 p-3 space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Tools
          </div>
          <SidebarLink icon={Coins} label="Hedera Blockchain" />
          <SidebarLink icon={Database} label="MongoDB" />
          <SidebarLink icon={Github} label="GitHub" />
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-800 p-3">
        <button
          className={clsx(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
            'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
            !isOpen && 'justify-center'
          )}
        >
          <Settings className="w-4 h-4" />
          {isOpen && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
