// such.gallery - NFT Card component (newspaper style)

'use client';

import { resolveIPFS } from '@/lib/ipfs';
import { NFT } from '@/lib/subgraph';
import { memo } from 'react';

interface NFTCardProps {
  nft: NFT;
  onClick?: () => void;
}

export const NFTCard = memo(function NFTCard({ nft, onClick }: NFTCardProps) {
  const image = nft.image ? resolveIPFS(nft.image) : '/placeholder.png';
  
  return (
    <article 
      className="border-b border-black dark:border-white pb-6 mb-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Image - no lazy loading, stable container */}
      <div className="aspect-square mb-4 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image}
          alt=""
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: nft.image ? 1 : 0 }}
        />
      </div>
      
      {/* Collection tag */}
      <p className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
        {nft.collection}
      </p>
      
      {/* Title - bold, serif */}
      <h3 className="font-serif text-xl font-bold mb-2">
        {nft.name}
      </h3>
      
      {/* Meta row - seller and price */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {nft.seller?.slice(0, 6)}...{nft.seller?.slice(-4)}
        </span>
        {nft.price && (
          <span className="font-bold underline decoration-1 underline-offset-4">
            {nft.price}
          </span>
        )}
      </div>
    </article>
  );
});
