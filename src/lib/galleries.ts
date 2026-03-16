// Gallery types and mock data

export interface Gallery {
  id: string;
  title: string;
  description: string;
  links: GalleryLink[];
  creatorName: string;
  creatorFid?: number;
  createdAt: string;
  updatedAt: string;
  totalRevenue: string; // ETH
}

export type GalleryLink =
  | { type: 'cryptoart_listing'; url: string; listingId: string }
  | { type: 'farcaster_cast'; hash: string; author?: string }
  | { type: 'nft'; contract: string; tokenId: string; chainId: number };

// Mock galleries for Day 001
export const mockGalleries: Gallery[] = [
  {
    id: 'genesis-01',
    title: 'Genesis Collection',
    description: 'The first curated selection of works from cryptoart.social artists.',
    links: [
      { type: 'cryptoart_listing', url: 'https://cryptoart.social/listing/1', listingId: '1' },
      { type: 'cryptoart_listing', url: 'https://cryptoart.social/listing/2', listingId: '2' },
      { type: 'farcaster_cast', hash: '0xabc123', author: 'mxjxn' },
    ],
    creatorName: 'mxjxn',
    creatorFid: 4905,
    createdAt: '2026-03-16T00:00:00Z',
    updatedAt: '2026-03-16T18:00:00Z',
    totalRevenue: '0.0',
  },
  {
    id: 'digital-dreams',
    title: 'Digital Dreams',
    description: 'Surreal and abstract works exploring the boundaries of digital art.',
    links: [
      { type: 'nft', contract: '0x1234...abcd', tokenId: '1', chainId: 8453 },
      { type: 'nft', contract: '0x1234...abcd', tokenId: '2', chainId: 8453 },
      { type: 'cryptoart_listing', url: 'https://cryptoart.social/listing/5', listingId: '5' },
    ],
    creatorName: 'suchbot',
    creatorFid: 874249,
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-16T12:00:00Z',
    totalRevenue: '0.0',
  },
  {
    id: 'onchain-origins',
    title: 'Onchain Origins',
    description: 'Early works from artists who shaped the cryptoart movement.',
    links: [
      { type: 'farcaster_cast', hash: '0xdef456' },
      { type: 'cryptoart_listing', url: 'https://cryptoart.social/listing/10', listingId: '10' },
    ],
    creatorName: 'cryptoart',
    createdAt: '2026-03-14T00:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
    totalRevenue: '0.0',
  },
];

// Parse URL into GalleryLink
export function parseGalleryLink(url: string): GalleryLink | null {
  // cryptoart.social/listing/:id
  const listingMatch = url.match(/cryptoart\.social\/listing\/(\d+)/);
  if (listingMatch) {
    return {
      type: 'cryptoart_listing',
      url,
      listingId: listingMatch[1],
    };
  }

  // Farcaster cast hash (0x...)
  const castMatch = url.match(/^(0x[a-fA-F0-9]{64})$/);
  if (castMatch) {
    return { type: 'farcaster_cast', hash: castMatch[1] };
  }

  // Farcaster URL patterns
  const farcasterUrlMatch = url.match(/farcaster\.xyz\/.*\/(0x[a-fA-F0-9]{64})/);
  if (farcasterUrlMatch) {
    return { type: 'farcaster_cast', hash: farcasterUrlMatch[1] };
  }

  // NFT: contract/tokenId/chainId
  const nftMatch = url.match(/^(0x[a-fA-F0-9]{40})\/(\d+)\/(\d+)$/);
  if (nftMatch) {
    return {
      type: 'nft',
      contract: nftMatch[1],
      tokenId: nftMatch[2],
      chainId: parseInt(nftMatch[3]),
    };
  }

  return null;
}
