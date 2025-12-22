'use client';

import { useRef, useEffect } from 'react';
import { useOpencode } from '@/components/providers/OpencodeProvider';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { StreamingIndicator } from './StreamingIndicator';
import { WelcomeScreen } from './WelcomeScreen';

export function ChatContainer() {
  const {
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    abortMessage,
    currentSession,
    createSession,
  } = useOpencode();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSend = async (content: string) => {
    if (!currentSession) {
      await createSession();
    }
    await sendMessage(content);
  };

  const showWelcome = messages.length === 0 && !streamingContent;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        {showWelcome ? (
          <WelcomeScreen onPrompt={handleSend} />
        ) : (
          <>
            <MessageList messages={messages} />
            {streamingContent && (
              <StreamingIndicator content={streamingContent} />
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4">
        <ChatInput
          onSend={handleSend}
          onAbort={abortMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
