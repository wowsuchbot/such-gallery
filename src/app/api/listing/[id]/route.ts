// such.gallery - API route for listing preview

import { NextResponse } from 'next/server';

// Note: The Graph gateway requires API key authentication
// For now, return mock data so the preview UI works
// TODO: Add GRAPH_API_KEY to .env.local and implement real subgraph queries

const MOCK_LISTINGS: Record<string, any> = {
  '118': {
    listingId: '118',
    name: 'Abstract Composition #42',
    price: '0.0500 ETH',
    seller: '0x1234567890abcdef1234567890abcdef12345678',
    tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    tokenId: '42',
    image: null,
    status: 'ACTIVE',
    collection: 'cryptoart.social',
  },
  '1': {
    listingId: '1',
    name: 'Genesis Piece',
    price: '1.0000 ETH',
    seller: '0xabcdef1234567890abcdef1234567890abcdef12',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    tokenId: '1',
    image: null,
    status: 'ACTIVE',
    collection: 'cryptoart.social',
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listingId = id;

  // Check mock data first
  if (MOCK_LISTINGS[listingId]) {
    return NextResponse.json({
      id: `mock-${listingId}`,
      ...MOCK_LISTINGS[listingId],
      createdAt: new Date().toISOString(),
    });
  }

  // For any other listing ID, return a generic mock response
  // This allows testing the preview UI without real data
  return NextResponse.json({
    id: `mock-${listingId}`,
    listingId,
    name: `NFT #${listingId}`,
    price: `${(Math.random() * 0.1).toFixed(4)} ETH`,
    seller: '0x1234567890abcdef1234567890abcdef12345678',
    tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    tokenId: listingId,
    image: null,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    collection: 'cryptoart.social',
  });
}
