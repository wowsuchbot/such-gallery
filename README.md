# such.gallery

An open gallery Farcaster miniapp. Artists can submit their art, anyone can curate.

## Features

- **Curation System**: Create and manage curated collections of NFTs
- **Quote-Cast Integration**: Share collections/NFTs via quote-casts with referral tracking
- **NFT Metadata Caching**: Automatic metadata caching with manual refresh
- **Sales Integration**: Display LSSVM pools and Auctionhouse listings
- **Farcaster Miniapp**: Full integration with Farcaster ecosystem via Neynar

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Farcaster signers via Neynar
- **NFT Data**: Alchemy API + metadata cache
- **Sales Data**: Direct subgraph queries (Base Auctionhouse subgraph)
- **UI**: Tailwind CSS

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/wowsuchbot/such-gallery.git
cd such-gallery
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/such_gallery
NEYNAR_API_KEY=your_neynar_api_key
NEXT_PUBLIC_URL=http://localhost:3000
ALCHEMY_API_KEY=your_alchemy_api_key
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEYNAR_API_KEY` - Neynar API key for Farcaster integration
- `NEXT_PUBLIC_URL` - Public URL of the app (e.g., http://localhost:3000)

### Optional
- `NEYNAR_CLIENT_ID` - Neynar client ID for webhooks
- `ALCHEMY_API_KEY` - Alchemy API key for NFT metadata
- `SESSION_PASSWORD` - Password for session encryption (min 32 characters)

## Database Schema

See `src/lib/schema.ts` for the full schema. Key tables:
- `such_gallery_users` - User data (FID + optional wallet)
- `curated_galleries` - User-created curation lists
- `curated_gallery_nfts` - NFTs in collections with curator metadata
- `nft_metadata_cache` - Cached NFT metadata
- `quote_casts` - Quote-cast tracking for referrals
- `admin_users` - Admin FIDs

## API Routes

### Collections
- `GET /api/collections` - List collections
- `POST /api/collections` - Create collection
- `GET /api/collections/[id]` - Get collection with NFTs
- `PUT /api/collections/[id]` - Update collection
- `DELETE /api/collections/[id]` - Delete collection
- `POST /api/collections/[id]/nfts` - Add NFT to collection
- `DELETE /api/collections/[id]/nfts` - Remove NFT from collection

### NFT Metadata
- `GET /api/nfts/metadata` - Get cached or fetch NFT metadata
- `POST /api/nfts/metadata/refresh` - Manually refresh NFT metadata

### Quote-Casts
- `GET /api/quote-casts` - List quote-casts
- `POST /api/quote-casts` - Track a quote-cast

### Sales Data
- `GET /api/sales/[contractAddress]` - Get pools + auctions
- `GET /api/pools/[poolAddress]` - Get pool details
- `GET /api/listings/[listingId]` - Get listing details

### Admin
- `POST /api/admin/refresh-metadata` - Bulk refresh collection metadata

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Vercel

You'll need to set these in your Vercel project settings:

```
DATABASE_URL=postgresql://...
NEYNAR_API_KEY=...
NEXT_PUBLIC_URL=https://such-gallery.vercel.app
ALCHEMY_API_KEY=...
SESSION_PASSWORD=...
```

## Development

### Database Migrations

```bash
# Generate migration files
npm run db:generate

# Push schema to database (dev)
npm run db:push

# Run migrations (production)
npm run db:migrate
```

### Build

```bash
npm run build
```

## Referral System

When a curator quote-casts a collection or NFT, the system tracks it with their wallet address. When users purchase via the quote-cast link, the referral address is passed to the Auctionhouse contract, and the curator receives a referral fee.

## License

MIT
