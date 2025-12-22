'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSend: (content: string) => void;
  onAbort?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({ onSend, onAbort, disabled, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative flex items-end gap-2 bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-primary-500 transition-colors">
        {/* Attach button */}
        <button
          type="button"
          className="p-3 text-gray-400 hover:text-gray-200 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Message Taurus AI..."
          rows={1}
          disabled={disabled}
          className={clsx(
            'flex-1 bg-transparent py-3 pr-2 resize-none outline-none',
            'placeholder:text-gray-500 text-gray-100',
            'max-h-[200px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Send/Stop button */}
        {isLoading ? (
          <button
            type="button"
            onClick={onAbort}
            className="p-3 text-red-400 hover:text-red-300 transition-colors"
            title="Stop generating"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className={clsx(
              'p-3 transition-colors',
              input.trim()
                ? 'text-primary-500 hover:text-primary-400'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
