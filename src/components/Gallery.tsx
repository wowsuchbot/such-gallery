// such.gallery - Gallery grid component

'use client';

import { NFT } from '@/lib/subgraph';
import { NFTCard } from './NFTCard';

interface GalleryProps {
  nfts: NFT[];
  onNFTClick?: (nft: NFT) => void;
}

export function Gallery({ nfts, onNFTClick }: GalleryProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 font-serif text-lg">
          No listings found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
      {nfts.map((nft) => (
        <NFTCard 
          key={nft.id} 
          nft={nft} 
          onClick={() => onNFTClick?.(nft)}
        />
      ))}
    </div>
  );
}
