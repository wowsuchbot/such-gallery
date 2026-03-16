// such.gallery - NFT Modal component

'use client';

import { resolveIPFS } from '@/lib/ipfs';
import { NFT } from '@/lib/subgraph';
import { memo, useEffect, useCallback } from 'react';

interface NFTModalProps {
  nft: NFT | null;
  onClose: () => void;
}

export const NFTModal = memo(function NFTModal({ nft, onClose }: NFTModalProps) {
  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!nft) return null;

  const image = nft.image ? resolveIPFS(nft.image) : '/placeholder.png';

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-black border border-black dark:border-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="float-right m-4 text-2xl leading-none hover:opacity-50"
          aria-label="Close"
        >
          ×
        </button>

        {/* Image - stable container */}
        <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image}
            alt=""
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {nft.collection}
          </p>
          
          <h2 className="font-serif text-2xl font-bold mb-4">
            {nft.name}
          </h2>

          <div className="space-y-3 border-t border-black dark:border-white pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Seller</span>
              <span className="font-mono">{nft.seller?.slice(0, 6)}...{nft.seller?.slice(-4)}</span>
            </div>
            {nft.price && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price</span>
                <span className="font-bold underline">{nft.price}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Token ID</span>
              <span className="font-mono">#{nft.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Contract</span>
              <span className="font-mono">{nft.contract?.slice(0, 6)}...{nft.contract?.slice(-4)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a 
              href={`https://cryptoart.social/listing/${nft.listingId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 bg-black dark:bg-white text-white dark:text-black font-bold"
            >
              View on cryptoart.social
            </a>
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-black dark:border-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
