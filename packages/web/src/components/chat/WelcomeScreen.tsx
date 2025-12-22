'use client';

import { Sparkles, Code, Database, Coins } from 'lucide-react';

interface WelcomeScreenProps {
  onPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Code,
    title: 'Write Code',
    prompt: 'Help me create a React component for a dashboard',
    color: 'text-blue-400',
  },
  {
    icon: Coins,
    title: 'Hedera Blockchain',
    prompt: 'Check my Hedera account balance and show token holdings',
    color: 'text-purple-400',
  },
  {
    icon: Database,
    title: 'Database Query',
    prompt: 'Help me write a MongoDB aggregation pipeline',
    color: 'text-green-400',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant',
    prompt: 'Explain how the OpenCode AI SDK works',
    color: 'text-yellow-400',
  },
];

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Logo */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hedera-purple to-primary-500 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Welcome to Taurus AI</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Your intelligent development platform with blockchain integration.
        Ask anything or try a suggestion below.
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.title}
            onClick={() => onPrompt(suggestion.prompt)}
            className="flex items-start gap-3 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-colors text-left group"
          >
            <suggestion.icon className={`w-5 h-5 mt-0.5 ${suggestion.color}`} />
            <div>
              <div className="font-medium text-gray-200 group-hover:text-white">
                {suggestion.title}
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-400">
                {suggestion.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Network Status */}
      <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Connected to Hedera Testnet
      </div>
    </div>
  );
}
