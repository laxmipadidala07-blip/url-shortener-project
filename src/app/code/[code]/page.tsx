// src/app/code/[code]/page.tsx
// Stats page - Detailed view for a single link

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, MousePointerClick, Clock } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

interface PageProps {
  params: Promise<{ code: string }>;
}

async function getLinkStats(code: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/links/${code}`, {
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching link stats:', error);
    return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeTime(dateString: string | null) {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return formatDate(dateString);
}

export default async function StatsPage({ params }: PageProps) {
  const { code } = await params;
  const link = await getLinkStats(code);

  // If link not found, show 404 page
  if (!link) {
    notFound();
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${code}`;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Link Statistics
        </h1>
        <p className="mt-2 text-gray-600">
          Detailed analytics for your short link
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Link Details */}
        <div className="space-y-6">
          {/* Short Code Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Short Code</h2>
            <code className="mt-3 block rounded-lg bg-gray-100 px-4 py-3 text-xl font-mono text-gray-900">
              {link.code}
            </code>
            <div className="mt-4">
              <CopyButton text={shortUrl} label="Copy Short URL" className="w-full justify-center" />
            </div>
          </div>

          {/* Target URL Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Target URL</h2>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-4 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="break-all">{link.targetUrl}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Statistics */}
        <div className="space-y-6">
          {/* Click Statistics Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Analytics</h2>
            
            <div className="space-y-6">
              {/* Total Clicks */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <MousePointerClick className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{link.totalClicks}</p>
                </div>
              </div>

              {/* Last Clicked */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Last Clicked</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatRelativeTime(link.lastClickedAt)}
                  </p>
                  {link.lastClickedAt && (
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(link.lastClickedAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatRelativeTime(link.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(link.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                Test Short URL
              </a>
              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}