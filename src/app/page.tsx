// src/app/page.tsx
// Dashboard page - Main view with form and links table

'use client';

import { useState, useEffect } from 'react';
import AddLinkForm from '@/components/AddLinkForm';
import LinkTable from '@/components/LinkTable';
import type { CreateLinkResponse } from '@/types';

export default function DashboardPage() {
  const [links, setLinks] = useState<CreateLinkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/links');
      
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data: CreateLinkResponse[] = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkCreated = (newLink: CreateLinkResponse) => {
    // Add new link to the beginning of the list
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleLinkDeleted = (code: string) => {
    // Remove deleted link from the list
    setLinks((prevLinks) => prevLinks.filter((link) => link.code !== code));
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Create and manage your short links
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Add Link Form (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <AddLinkForm onLinkCreated={handleLinkCreated} />
        </div>

        {/* Right Column: Links Table (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-red-900">Error Loading Links</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchLinks}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <LinkTable
              links={links}
              onLinkDeleted={handleLinkDeleted}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}