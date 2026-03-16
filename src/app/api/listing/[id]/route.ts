// such.gallery - API route for listing preview

import { NextResponse } from 'next/server';

const GRAPH_API_URL = 'https://gateway.thegraph.com/api/subgraphs/id/BFHnXWdnn9gt4tK2jag8enxFcG23Lu43hXaXNmgc44mV';

interface NFTMetadata {
  tokenURI: string;
  name: string | null;
  image: string | null;
  imageGateway: string | null;
  description: string | null;
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
      const baseRPC = process.env.ALCHEMY_BASE_RPC || 'https://base.llamarpc.com';
      
      // ERC-721 tokenURI(uint256) call
      const metadataCall = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: listing.tokenAddress,
          data: `0xc87b56dd${listing.tokenId.padStart(64, '0')}` // tokenURI(uint256)
        }, 'latest']
      };

      const rpcResponse = await fetch(baseRPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataCall),
      });

      const rpcData = await rpcResponse.json();
      
      if (rpcData.result && rpcData.result !== '0x') {
        // Decode the URI (remove 0x prefix, decode hex to string)
        const hex = rpcData.result.slice(2);
        let uri = '';
        for (let i = 0; i < hex.length; i += 2) {
          const charCode = parseInt(hex.substr(i, 2), 16);
          if (charCode !== 0) {
            uri += String.fromCharCode(charCode);
          }
        }
        
        // Handle IPFS URIs
        if (uri.startsWith('ipfs://')) {
          const cid = uri.replace('ipfs://', '');
          // Fetch metadata from IPFS gateway
          try {
            const metaRes = await fetch(`https://ipfs.io/ipfs/${cid}`, { 
              signal: AbortSignal.timeout(5000) 
            });
            const metadata = await metaRes.json();
            
            let imageGateway: string | null = null;
            const image = metadata.image || metadata.image_url || null;
            
            // Convert IPFS image URLs to gateway URLs
            if (image?.startsWith('ipfs://')) {
              const imageCid = image.replace('ipfs://', '');
              imageGateway = `https://ipfs.io/ipfs/${imageCid}`;
            }
            
            nftMetadata = {
              tokenURI: uri,
              name: metadata.name || metadata.title || null,
              image: image,
              imageGateway: imageGateway,
              description: metadata.description || null,
            };
          } catch (e) {
            console.error('Failed to fetch IPFS metadata:', e);
            // Fallback to just showing the IPFS link
            nftMetadata = {
              tokenURI: uri,
              imageGateway: `https://ipfs.io/ipfs/${cid}`,
              name: null,
              image: null,
              description: null,
            };
          }
        } else if (uri.startsWith('http')) {
          // HTTP URI - fetch metadata
          try {
            const metaRes = await fetch(uri, { 
              signal: AbortSignal.timeout(5000) 
            });
            const metadata = await metaRes.json();
            
            let imageGateway: string | null = null;
            const image = metadata.image || metadata.image_url || null;
            
            // Convert IPFS image URLs to gateway URLs
            if (image?.startsWith('ipfs://')) {
              const imageCid = image.replace('ipfs://', '');
              imageGateway = `https://ipfs.io/ipfs/${imageCid}`;
            }
            
            nftMetadata = {
              tokenURI: uri,
              name: metadata.name || metadata.title || null,
              image: image,
              imageGateway: imageGateway,
              description: metadata.description || null,
            };
          } catch (e) {
            console.error('Failed to fetch HTTP metadata:', e);
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
      // NFT metadata
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
