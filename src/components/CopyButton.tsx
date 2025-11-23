// src/components/CopyButton.tsx
// Copy to clipboard button with visual feedback

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`
        inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
        transition-all duration-200
        ${
          copied
            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 ring-1 ring-gray-200 hover:ring-gray-300'
        }
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}