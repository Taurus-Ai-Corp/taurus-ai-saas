'use client';

import { clsx } from 'clsx';
import { User, Bot, Wrench } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    status: string;
    result?: string;
  }>;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary-600' : 'bg-hedera-purple'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={clsx('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        {/* Tool calls */}
        {message.toolCalls?.map((tool) => (
          <div
            key={tool.id}
            className={clsx(
              'tool-indicator',
              tool.status === 'running' && 'tool-running',
              tool.status === 'completed' && 'tool-completed',
              tool.status === 'error' && 'tool-error'
            )}
          >
            <Wrench className="w-3 h-3" />
            <span>{tool.name}</span>
          </div>
        ))}

        {/* Message bubble */}
        <div
          className={clsx(
            'chat-bubble',
            isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {formatContent(message.content)}
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function formatContent(content: string): React.ReactNode {
  // Simple markdown-like formatting
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, i) => {
    // Code blocks
    if (part.startsWith('```')) {
      const code = part.replace(/```\w*\n?/g, '').trim();
      return (
        <pre key={i} className="code-block my-2">
          <code>{code}</code>
        </pre>
      );
    }

    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-gray-700 px-1 rounded text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
