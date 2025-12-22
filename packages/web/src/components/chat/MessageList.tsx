'use client';

import { MessageBubble } from './MessageBubble';

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

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
