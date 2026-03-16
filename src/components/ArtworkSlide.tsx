// ArtworkSlide - Full viewport artwork display

'use client';

import { useState, useEffect } from 'react';

interface ArtworkData {
  listingId: string;
  name: string;
  description: string | null;
  image: string | null;
  imageGateway: string | null;
  price: string | null;
  seller: string;
  status: string;
  tokenAddress: string;
  tokenId: string;
  collection: string;
}

interface ArtworkSlideProps {
  listingId: string;
  index: number;
}

export function ArtworkSlide({ listingId, index }: ArtworkSlideProps) {
  const [data, setData] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/listing/${listingId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch artwork');
        }
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [listingId]);

  // Background colors for variety (when no image)
  const bgColors = [
    'bg-gradient-to-br from-gray-900 to-gray-800',
    'bg-gradient-to-br from-indigo-900 to-purple-900',
    'bg-gradient-to-br from-emerald-900 to-teal-900',
    'bg-gradient-to-br from-rose-900 to-pink-900',
    'bg-gradient-to-br from-amber-900 to-orange-900',
  ];
  const bgColor = bgColors[index % bgColors.length];

  if (loading) {
    return (
      <div className={`h-screen w-full ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white animate-spin rounded-full mx-auto mb-4" />
          <p className="font-mono text-sm text-white/60">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-400 mb-2">Failed to load artwork</p>
          <p className="font-mono text-xs text-gray-500">Listing #{listingId}</p>
        </div>
      </div>
    );
  }

  const sellerShort = `${data.seller.slice(0, 6)}...${data.seller.slice(-4)}`;

  return (
    <div className={`h-screen w-full ${bgColor} relative overflow-hidden`}>
      {/* Artwork Image */}
      {data.imageGateway ? (
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
          <img
            src={data.imageGateway}
            alt={data.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[20rem] font-serif text-white/10 select-none">
            {data.name?.charAt(0) || '#'}
          </span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      
      {/* Metadata overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
        <div className="max-w-2xl">
          {/* Listing number */}
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs px-2 py-1 bg-white/10 text-white/70">
              #{data.listingId}
            </span>
            {data.status === 'ACTIVE' ? (
              <span className="font-mono text-xs px-2 py-1 bg-green-500/20 text-green-400">
                Active
              </span>
            ) : (
              <span className="font-mono text-xs px-2 py-1 bg-gray-500/20 text-gray-400">
                {data.status}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {data.name}
          </h2>

          {/* Description */}
          {data.description && (
            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
              {data.description}
            </p>
          )}

          {/* Auction info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {data.price && (
              <div>
                <span className="text-gray-400">Price: </span>
                <span className="text-white font-medium">{data.price}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Seller: </span>
              <span className="font-mono text-white/70">{sellerShort}</span>
            </div>
            <div>
              <span className="text-gray-400">Collection: </span>
              <span className="text-white/70">{data.collection}</span>
            </div>
          </div>

          {/* View on cryptoart.social */}
          <a
            href={`https://cryptoart.social/listing/${data.listingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors"
          >
            View on cryptoart.social
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Artwork counter */}
      <div className="absolute top-6 right-6 font-mono text-xs text-white/40">
        {index + 1}
      </div>
    </div>
  );
}
