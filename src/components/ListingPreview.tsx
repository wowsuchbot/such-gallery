// ListingPreview - Compact preview card for cryptoart.social listing

'use client';

import { useState, useEffect } from 'react';

interface ListingPreviewData {
  listingId: string;
  name: string;
  price: string | null;
  seller: string;
  tokenAddress: string;
  tokenId: string;
  image: string | null;
  status: string;
}

interface ListingPreviewProps {
  listingId: string;
  onRemove?: () => void;
}

export function ListingPreview({ listingId, onRemove }: ListingPreviewProps) {
  const [data, setData] = useState<ListingPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/listing/${listingId}`);
        if (!res.ok) {
          throw new Error('Listing not found');
        }
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 animate-pulse w-24 mb-2" />
          <div className="h-2 bg-gray-200 dark:bg-gray-700 animate-pulse w-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
        <span className="text-sm text-red-600 dark:text-red-400">#{listingId}: {error}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  if (!data) return null;

  const sellerShort = `${data.seller.slice(0, 6)}...${data.seller.slice(-4)}`;

  return (
    <div className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      {/* Thumbnail */}
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-serif text-gray-300">
            {data.name?.charAt(0) || '#'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
            #{data.listingId}
          </span>
          {data.price && (
            <span className="font-mono text-xs text-green-600 dark:text-green-400">
              {data.price}
            </span>
          )}
        </div>
        <p className="text-sm truncate mt-0.5">{data.name}</p>
        <p className="font-mono text-xs text-gray-400 truncate">
          {sellerShort}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={`https://cryptoart.social/listing/${data.listingId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors"
        >
          View
        </a>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 text-sm"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
