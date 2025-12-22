'use client';

import { ReactNode } from 'react';
import { OpencodeProvider } from './OpencodeProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <OpencodeProvider>
      {children}
    </OpencodeProvider>
  );
}
