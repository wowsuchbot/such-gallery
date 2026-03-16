// such.gallery - IPFS metadata fetching via Pinata

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

// Resolve IPFS URI to HTTP URL
export function resolveIPFS(uri: string | null | undefined): string {
  if (!uri) return '/placeholder.png';
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', IPFS_GATEWAY);
  }
  if (uri.startsWith('Qm') || uri.startsWith('baf')) {
    return IPFS_GATEWAY + uri;
  }
  return uri;
}

// Fetch NFT metadata from IPFS
export async function fetchMetadata(tokenURI: string): Promise<NFTMetadata | null> {
  try {
    const url = resolveIPFS(tokenURI);
    const response = await fetch(url, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    return null;
  }
}

// Fetch with Pinata gateway (if API key provided)
export async function fetchWithPinata(
  cid: string, 
  pinataGateway?: string,
  pinataApiKey?: string
): Promise<NFTMetadata | null> {
  try {
    const gateway = pinataGateway || 'https://gateway.pinata.cloud/ipfs/';
    const url = `${gateway}${cid}`;
    
    const headers: Record<string, string> = {};
    if (pinataApiKey) {
      headers['pinata_api_key'] = pinataApiKey;
    }
    
    const response = await fetch(url, { headers });
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch via Pinata:', error);
    return null;
  }
}
