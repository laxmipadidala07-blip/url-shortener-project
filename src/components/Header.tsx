// src/components/Header.tsx
// Site header with Windows 11 inspired design

import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              TinyLink
            </span>
            <span className="text-xs text-gray-500">
              URL Shortener
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}