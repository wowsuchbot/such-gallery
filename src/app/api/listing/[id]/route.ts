// such.gallery - API route for listing preview

import { NextResponse } from 'next/server';

const GRAPH_API_URL = 'https://gateway.thegraph.com/api/subgraphs/id/BFHnXWdnn9gt4tK2jag8enxFcG23Lu43hXaXNmgc44mV';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listingId = id;

  const apiKey = process.env.GRAPH_API_KEY || process.env.NEXT_PUBLIC_GRAPH_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      error: 'GRAPH_API_KEY not configured',
      hint: 'Add GRAPH_API_KEY to .env.local'
    }, { status: 500 });
  }

  const query = `
    query Listing($listingId: String!) {
      listings(where: { listingId: $listingId }) {
        id
        listingId
        tokenAddress
        tokenId
        seller
        initialAmount
        erc20
        status
        createdAt
      }
    }
  `;

  try {
    const response = await fetch(GRAPH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, variables: { listingId } }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Subgraph errors:', data.errors);
      return NextResponse.json({ error: data.errors[0]?.message || 'Subgraph error' }, { status: 500 });
    }

    const listings = data.data?.listings || [];

    if (listings.length === 0) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const listing = listings[0];
    const priceEth = listing.initialAmount 
      ? `${(parseInt(listing.initialAmount) / 1e18).toFixed(4)} ETH`
      : null;

    return NextResponse.json({
      id: listing.id,
      listingId: listing.listingId,
      tokenAddress: listing.tokenAddress,
      tokenId: listing.tokenId,
      seller: listing.seller,
      price: priceEth,
      status: listing.status,
      createdAt: listing.createdAt,
      name: `NFT #${listing.tokenId}`,
      image: null,
      collection: 'cryptoart.social',
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}
