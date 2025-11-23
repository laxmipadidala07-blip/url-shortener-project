// src/components/LinkTable.tsx
// Table component to display all links with actions

'use client';

import { useState } from 'react';
import { ExternalLink, Trash2, Loader2, AlertCircle } from 'lucide-react';
import CopyButton from './CopyButton';
import type { CreateLinkResponse } from '@/types';

interface LinkTableProps {
  links: CreateLinkResponse[];
  onLinkDeleted?: (code: string) => void;
  isLoading?: boolean;
}

export default function LinkTable({ links, onLinkDeleted, isLoading = false }: LinkTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete the link "${code}"?`)) {
      return;
    }

    setError(null);
    setDeletingCode(code);

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete link');
      }

      // Notify parent component
      if (onLinkDeleted) {
        onLinkDeleted(code);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeletingCode(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getShortUrl = (code: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${code}`;
    }
    return `/${code}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-600">Loading links...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-3">
            <ExternalLink className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No links yet</h3>
          <p className="text-center text-sm text-gray-600">
            Create your first short link using the form above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 border-b border-gray-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Table Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Links</h3>
        <p className="mt-0.5 text-sm text-gray-600">{links.length} total links</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Target URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Last Clicked
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-900">
                    {link.code}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    title={link.targetUrl}
                  >
                    <span>{truncateUrl(link.targetUrl)}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {link.totalClicks}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {formatDate(link.lastClickedAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CopyButton text={getShortUrl(link.code)} label="Copy" className="text-xs" />
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete link"
                    >
                      {deletingCode === link.code ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-gray-200 md:hidden">
        {links.map((link) => (
          <div key={link.id} className="p-4 space-y-3">
            {/* Code */}
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Short Code</p>
              <code className="mt-1 block rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-900">
                {link.code}
              </code>
            </div>

            {/* Target URL */}
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Target URL</p>
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                title={link.targetUrl}
              >
                <span>{truncateUrl(link.targetUrl, 40)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Clicks</p>
                <p className="mt-1 text-sm text-gray-900">{link.totalClicks}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Last Clicked</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(link.lastClickedAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <CopyButton text={getShortUrl(link.code)} label="Copy Link" className="flex-1 justify-center text-xs" />
              <button
                onClick={() => handleDelete(link.code)}
                disabled={deletingCode === link.code}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingCode === link.code ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}