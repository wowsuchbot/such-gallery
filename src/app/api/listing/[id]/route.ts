// such.gallery - API route for listing preview

import { NextResponse } from 'next/server';

const GRAPH_API_URL = 'https://gateway.thegraph.com/api/subgraphs/id/BFHnXWdnn9gt4tK2jag8enxFcG23Lu43hXaXNmgc44mV';

// Gateways for different protocols
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs';
const ARWEAVE_GATEWAYS = [
  'https://ar-io.dev',
  'https://gateway.irys.xyz',
  'https://arweave.net',
];

interface NFTMetadata {
  tokenURI: string;
  name: string | null;
  image: string | null;
  imageGateway: string | null;
  description: string | null;
}

// Convert IPFS or Arweave URI to gateway URL
function uriToGateway(uri: string | null | undefined): string | null {
  if (!uri) return null;
  
  // IPFS
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    return `${IPFS_GATEWAY}/${cid}`;
  }
  if (uri.includes('/ipfs/')) {
    const cidMatch = uri.match(/\/ipfs\/([^/]+)/);
    if (cidMatch) {
      return `${IPFS_GATEWAY}/${cidMatch[1]}`;
    }
  }
  
  // Arweave - use first gateway (fallback handled in fetch)
  if (uri.startsWith('ar://')) {
    const txId = uri.replace('ar://', '');
    return `${ARWEAVE_GATEWAYS[0]}/${txId}`;
  }
  
  // Already HTTP URL
  if (uri.startsWith('http')) {
    return uri;
  }
  return null;
}

// Fetch with Arweave gateway fallbacks
async function fetchWithFallback(uri: string): Promise<Response | null> {
  // Arweave - try multiple gateways
  if (uri.startsWith('ar://')) {
    const txId = uri.replace('ar://', '');
    
    for (const gateway of ARWEAVE_GATEWAYS) {
      try {
        const url = `${gateway}/${txId}`;
        const res = await fetch(url, { 
          signal: AbortSignal.timeout(10000),
          headers: { 'Accept': 'application/json' },
        });
        
        if (res.ok) {
          return res;
        }
      } catch (e) {
        // Try next gateway
        continue;
      }
    }
    return null;
  }
  
  // Single gateway fetch for IPFS/HTTP
  const gatewayUrl = uriToGateway(uri);
  if (!gatewayUrl) return null;
  
  try {
    return await fetch(gatewayUrl, { 
      signal: AbortSignal.timeout(15000),
      headers: { 'Accept': 'application/json' },
    });
  } catch (e) {
    return null;
  }
}

// Decode ABI-encoded string from eth_call result
function decodeABIString(hex: string): string {
  if (!hex || hex === '0x') return '';
  
  const data = hex.slice(2);
  if (data.length < 128) return '';
  
  const lengthHex = data.slice(64, 128);
  const length = parseInt(lengthHex, 16);
  
  if (length === 0 || isNaN(length)) return '';
  
  const stringHex = data.slice(128, 128 + length * 2);
  
  let result = '';
  for (let i = 0; i < stringHex.length; i += 2) {
    const charCode = parseInt(stringHex.substr(i, 2), 16);
    if (charCode !== 0) {
      result += String.fromCharCode(charCode);
    }
  }
  
  return result;
}

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

    // Fetch NFT metadata from contract
    let nftMetadata: NFTMetadata | null = null;
    
    try {
      // Try multiple RPC endpoints
      const rpcEndpoints = [
        'https://base-rpc.publicnode.com',
        'https://mainnet.base.org',
      ];
      
      const tokenIdHex = listing.tokenId.padStart(64, '0');
      
      // Try ERC-721 tokenURI first, then ERC-1155 uri
      const calls = [
        { name: 'tokenURI', data: `0xc87b56dd${tokenIdHex}` },      // ERC-721
        { name: 'uri', data: `0x0e89341c${tokenIdHex}` },           // ERC-1155
      ];
      
      let rpcResult: string | null = null;
      
      for (const call of calls) {
        const metadataCall = {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{ to: listing.tokenAddress, data: call.data }, 'latest']
        };

        for (const rpc of rpcEndpoints) {
          try {
            const res = await fetch(rpc, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(metadataCall),
              signal: AbortSignal.timeout(5000),
            });
            
            const json = await res.json();
            if (json.result && json.result !== '0x' && !json.error) {
              rpcResult = json.result;
              break;
            }
          } catch (e) {
            // Try next endpoint
          }
        }
        
        if (rpcResult) break;
      }
      
      if (rpcResult) {
        const uri = decodeABIString(rpcResult);
        
        if (uri) {
          try {
            const metaRes = await fetchWithFallback(uri);
            
            if (metaRes && metaRes.ok) {
              const metadata = await metaRes.json();
              const image = metadata.image || metadata.image_url || metadata.media?.uri || null;
              
              nftMetadata = {
                tokenURI: uri,
                name: metadata.name || metadata.title || null,
                image: image,
                imageGateway: uriToGateway(image),
                description: metadata.description || null,
              };
            } else {
              console.error('Metadata fetch failed for URI:', uri);
            }
          } catch (e) {
            console.error('Failed to fetch metadata:', uri, e);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch NFT metadata:', e);
    }

    return NextResponse.json({
      id: listing.id,
      listingId: listing.listingId,
      tokenAddress: listing.tokenAddress,
      tokenId: listing.tokenId,
      seller: listing.seller,
      price: priceEth,
      status: listing.status,
      createdAt: listing.createdAt,
      name: nftMetadata?.name || `NFT #${listing.tokenId}`,
      image: nftMetadata?.image || null,
      imageGateway: nftMetadata?.imageGateway || null,
      description: nftMetadata?.description || null,
      collection: 'cryptoart.social',
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}
