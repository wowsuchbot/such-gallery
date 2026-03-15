import { pgTable, serial, text, boolean, timestamp, integer, uniqueIndex, index } from 'drizzle-orm/pg-core';

// Users table - stores Farcaster users with optional wallet address
export const suchGalleryUsers = pgTable('such_gallery_users', {
  fid: integer('fid').primaryKey().notNull(),
  ethAddress: text('eth_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Curated galleries - user-created collections of NFTs
export const curatedGalleries = pgTable('curated_galleries', {
  id: serial('id').primaryKey(),
  curatorFid: integer('curator_fid').notNull().references(() => suchGalleryUsers.fid),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  curatorSlugIdx: uniqueIndex('curator_slug_idx').on(table.curatorFid, table.slug),
}));

// NFTs in curated galleries
export const curatedGalleryNfts = pgTable('curated_gallery_nfts', {
  curatedGalleryId: integer('curated_gallery_id').notNull().references(() => curatedGalleries.id),
  contractAddress: text('contract_address').notNull(),
  tokenId: text('token_id').notNull(),
  curatorComment: text('curator_comment'),
  showDescription: boolean('show_description').default(false).notNull(),
  showAttributes: boolean('show_attributes').default(false).notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  pk: index('curated_gallery_nfts_pk').on(table.curatedGalleryId, table.contractAddress, table.tokenId),
}));

// NFT metadata cache
export const nftMetadataCache = pgTable('nft_metadata_cache', {
  contractAddress: text('contract_address').notNull(),
  tokenId: text('token_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  imageURI: text('image_uri').notNull(),
  animationURI: text('animation_uri'),
  attributes: text('attributes'), // JSON string
  tokenURI: text('token_uri'),
  metadataSource: text('metadata_source').default('alchemy').notNull(),
  cachedAt: timestamp('cached_at').defaultNow().notNull(),
  refreshedAt: timestamp('refreshed_at'),
}, (table) => ({
  pk: index('nft_metadata_cache_pk').on(table.contractAddress, table.tokenId),
}));

// Quote-casts for referral tracking
export const quoteCasts = pgTable('quote_casts', {
  id: serial('id').primaryKey(),
  curatorFid: integer('curator_fid').notNull().references(() => suchGalleryUsers.fid),
  castHash: text('cast_hash').notNull(),
  targetType: text('target_type').notNull(), // 'gallery' or 'nft'
  targetGalleryId: integer('target_gallery_id').references(() => curatedGalleries.id),
  targetContractAddress: text('target_contract_address'),
  targetTokenId: text('target_token_id'),
  referralAddress: text('referral_address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  castHashIdx: uniqueIndex('cast_hash_idx').on(table.castHash),
}));

// Admin users table
export const adminUsers = pgTable('admin_users', {
  fid: integer('fid').primaryKey().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
