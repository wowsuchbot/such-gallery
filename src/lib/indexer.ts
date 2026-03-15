/**
 * Direct subgraph queries to replace @cryptoart/unified-indexer
 */

const BASE_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/suchgallery/base-auctionhouse';

interface PoolData {
  poolAddress: string;
  nft: string;
  bondingCurve: string;
  spotPrice: string;
  delta: string;
  fee: string;
  ethBalance: string;
}

interface AuctionData {
  listingId: string;
  seller: string;
  token: string;
  tokenId: string;
  reservePrice: string;
  buyNowPrice: string;
  highestBid?: string;
  highestBidder?: string;
  expiresAt?: string;
}

interface SalesData {
  pools: PoolData[];
  auctions: AuctionData[];
}

/**
 * Execute a GraphQL query to the subgraph
 */
async function querySubgraph(query: string, variables: any = {}): Promise<any> {
  try {
    const response = await fetch(BASE_SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Subgraph query failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`Subgraph errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    console.error('Subgraph query error:', error);
    throw error;
  }
}

/**
 * Get pool data by address
 */
export async function getPoolData(poolAddress: string, chainId: number): Promise<PoolData | null> {
  if (chainId !== 8453) {
    throw new Error('Unsupported chain ID. Only Base mainnet (8453) is supported.');
  }

  const query = `
    query GetPool($poolAddress: String!) {
      pool(id: $poolAddress) {
        id
        nft {
          id
        }
        bondingCurve {
          id
        }
        spotPrice
        delta
        fee
        ethBalance
      }
    }
  `;

  try {
    const data = await querySubgraph(query, { poolAddress });

    if (!data.pool) {
      return null;
    }

    return {
      poolAddress: data.pool.id,
      nft: data.pool.nft.id,
      bondingCurve: data.pool.bondingCurve.id,
      spotPrice: data.pool.spotPrice,
      delta: data.pool.delta,
      fee: data.pool.fee,
      ethBalance: data.pool.ethBalance,
    };
  } catch (error) {
    console.error('Error fetching pool data:', error);
    return null;
  }
}

/**
 * Get auction data by listing ID
 */
export async function getAuctionData(listingId: string, chainId: number): Promise<AuctionData | null> {
  if (chainId !== 8453) {
    throw new Error('Unsupported chain ID. Only Base mainnet (8453) is supported.');
  }

  const query = `
    query GetAuction($listingId: String!) {
      auction(id: $listingId) {
        id
        seller {
          id
        }
        token {
          id
          tokenId
        }
        reservePrice
        buyNowPrice
        highestBid {
          id
          amount
          bidder {
            id
          }
          expiresAt
        }
      }
    }
  `;

  try {
    const data = await querySubgraph(query, { listingId });

    if (!data.auction) {
      return null;
    }

    return {
      listingId: data.auction.id,
      seller: data.auction.seller.id,
      token: data.auction.token.id,
      tokenId: data.auction.token.tokenId,
      reservePrice: data.auction.reservePrice,
      buyNowPrice: data.auction.buyNowPrice,
      highestBid: data.auction.highestBid?.amount,
      highestBidder: data.auction.highestBid?.bidder.id,
      expiresAt: data.auction.highestBid?.expiresAt,
    };
  } catch (error) {
    console.error('Error fetching auction data:', error);
    return null;
  }
}

/**
 * Get sales data for a collection (pools + auctions)
 */
export async function getSalesForCollection(
  contractAddress: string,
  chainId: number,
  options?: { first?: number; skip?: number }
): Promise<SalesData> {
  if (chainId !== 8453) {
    throw new Error('Unsupported chain ID. Only Base mainnet (8453) is supported.');
  }

  const first = options?.first || 100;
  const skip = options?.skip || 0;

  const query = `
    query GetCollectionSales($contractAddress: String!, $first: Int!, $skip: Int!) {
      pools(first: $first, skip: $skip, where: { nft: $contractAddress }) {
        id
        nft {
          id
        }
        bondingCurve {
          id
        }
        spotPrice
        delta
        fee
        ethBalance
      }
      auctions(first: $first, skip: $skip, where: { nft: $contractAddress }) {
        id
        seller {
          id
        }
        token {
          id
          tokenId
        }
        reservePrice
        buyNowPrice
        highestBid {
          id
          amount
          bidder {
            id
          }
          expiresAt
        }
      }
    }
  `;

  try {
    const data = await querySubgraph(query, {
      contractAddress: contractAddress.toLowerCase(),
      first,
      skip,
    });

    const pools: PoolData[] = (data.pools || []).map((pool: any) => ({
      poolAddress: pool.id,
      nft: pool.nft.id,
      bondingCurve: pool.bondingCurve.id,
      spotPrice: pool.spotPrice,
      delta: pool.delta,
      fee: pool.fee,
      ethBalance: pool.ethBalance,
    }));

    const auctions: AuctionData[] = (data.auctions || []).map((auction: any) => ({
      listingId: auction.id,
      seller: auction.seller.id,
      token: auction.token.id,
      tokenId: auction.token.tokenId,
      reservePrice: auction.reservePrice,
      buyNowPrice: auction.buyNowPrice,
      highestBid: auction.highestBid?.amount,
      highestBidder: auction.highestBid?.bidder.id,
      expiresAt: auction.highestBid?.expiresAt,
    }));

    return { pools, auctions };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return { pools: [], auctions: [] };
  }
}
