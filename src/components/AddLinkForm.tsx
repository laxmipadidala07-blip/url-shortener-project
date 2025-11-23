// src/components/AddLinkForm.tsx
// Form to create new short links with validation and error handling

'use client';

import { useState } from 'react';
import { Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CreateLinkResponse, ErrorResponse } from '@/types';

interface AddLinkFormProps {
  onLinkCreated?: (link: CreateLinkResponse) => void;
}

export default function AddLinkForm({ onLinkCreated }: AddLinkFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || 'Failed to create link');
      }

      // Success!
      const linkData = data as CreateLinkResponse;
      setSuccess(true);
      
      // Clear form
      setTargetUrl('');
      setCustomCode('');
      
      // Notify parent component
      if (onLinkCreated) {
        onLinkCreated(linkData);
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Short Link</h2>
        <p className="mt-1 text-sm text-gray-600">
          Shorten a long URL with an optional custom code
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800 ring-1 ring-green-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Link created successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target URL Input */}
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            disabled={isLoading}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Must start with http:// or https://
          </p>
        </div>

        {/* Custom Code Input */}
        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
            Custom Code <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="mylink"
            pattern="[A-Za-z0-9]{6,8}"
            maxLength={8}
            disabled={isLoading}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            6-8 characters, letters and numbers only. Leave blank for auto-generated code.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !targetUrl.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Create Short Link</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}