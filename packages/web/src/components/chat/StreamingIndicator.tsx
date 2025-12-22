'use client';

import { Bot } from 'lucide-react';

interface StreamingIndicatorProps {
  content: string;
}

export function StreamingIndicator({ content }: StreamingIndicatorProps) {
  return (
    <div className="flex gap-3 max-w-4xl mx-auto">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-hedera-purple flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="chat-bubble chat-bubble-assistant">
          <div className="whitespace-pre-wrap break-words cursor-blink">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
