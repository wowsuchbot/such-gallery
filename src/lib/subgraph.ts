// such.gallery - Subgraph queries for cryptoart.social

const GRAPH_API_URL = 'https://gateway.thegraph.com/api/subgraphs/id/BFHnXWdnn9gt4tK2jag8enxFcG23Lu43hXaXNmgc44mV';

export interface Listing {
  id: string;
  listingId: string;
  tokenAddress: string;
  tokenId: string;
  seller: string;
  initialAmount: string;
  erc20: string;
  status: string;
  createdAt: string;
  listingType: string;
}

export interface NFT {
  id: string;
  listingId: string;
  tokenId: string;
  contract: string;
  seller: string;
  price: string | null;
  name: string;
  collection: string;
  image: string | null;
  createdAt: string;
}

// Fetch active listings from subgraph
export async function fetchListings(limit: number = 24, apiKey?: string): Promise<Listing[]> {
  const query = `
    query Listings($first: Int!) {
      listings(first: $first, where: { status: "ACTIVE" }, orderBy: createdAt, orderDirection: desc) {
        id
        listingId
        tokenAddress
        tokenId
        seller
        initialAmount
        erc20
        status
        createdAt
        listingType
      }
    }
  `;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(GRAPH_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: { first: limit } }),
  });

  const data = await response.json();
  return data.data?.listings || [];
}

// Transform listing to NFT format
export function listingToNFT(listing: Listing): NFT {
  return {
    id: listing.id,
    listingId: listing.listingId,
    tokenId: listing.tokenId,
    contract: listing.tokenAddress,
    seller: listing.seller,
    price: listing.initialAmount ? `${(parseInt(listing.initialAmount) / 1e18).toFixed(4)} ETH` : null,
    name: `NFT #${listing.tokenId}`,
    collection: 'cryptoart.social',
    image: null,
    createdAt: listing.createdAt,
  };
}
